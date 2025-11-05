"use client";

import { useCallback, useMemo } from "react";
import { useStream, FetchStreamTransport } from "@langchain/langgraph-sdk/react";
import { AIMessage, ToolCall, ToolMessage } from "@langchain/core/messages";

import { WelcomeScreen } from "./Welcome";
import { ToolCallBubble, type ToolCallState } from "./ToolCall";
import { ErrorBubble } from "./ErrorBubble";
import { ChatInput } from "./ChatInput";

interface ChatInterfaceProps {
  apiKey: string;
}

function isAIMessage(message: unknown): boolean {
  if (!message || typeof message !== "object") return false;
  const msg = message as Record<string, unknown>;
  if (msg.type === "ai") return true;
  return AIMessage.isInstance(message);
}

function isToolMessage(message: unknown): boolean {
  if (!message || typeof message !== "object") return false;
  const msg = message as Record<string, unknown>;
  return msg.type === "tool";
}

function isHumanMessage(message: unknown): boolean {
  if (!message || typeof message !== "object") return false;
  const msg = message as Record<string, unknown>;
  return msg.type === "human";
}

// Helper function to extract text content from message
// Handles both string content and structured content arrays
function extractTextContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item === "object" && "text" in item) {
          return String(item.text);
        }
        return "";
      })
      .join("");
  }

  if (content && typeof content === "object" && "text" in content) {
    return String(content.text);
  }

  return String(content || "");
}

export default function ChatInterface({ apiKey }: ChatInterfaceProps) {

  // Create transport with API key - using closure to capture ref
  // Refs are only accessed in async callbacks (onRequest), not during render
  const transport = useMemo(() => {
    const apiKeyValue = apiKey;
    return new FetchStreamTransport({
      apiUrl: "/api/basic",
      onRequest: async (url: string, init: RequestInit) => {
        const customBody = JSON.stringify({
          ...(JSON.parse(init.body as string) || {}),
          apiKey: apiKeyValue,
        });

        return {
          ...init,
          method: "POST",
          headers: {
            ...(init.headers as Record<string, string>),
            "Content-Type": "application/json",
          },
          body: customBody,
        };
      },
    });
  }, [apiKey]);

  const stream = useStream({
    transport,
  });


  // Extract tool calls from messages
  // Use a Map keyed by message reference to avoid ID mismatches
  const toolCallsByMessage = useMemo(() => {
    const map = new Map<unknown, ToolCallState[]>();

    stream.messages.forEach((message, messageIndex) => {
      // Only process AI messages (check both SDK format and LangChain Core format)
      if (!isAIMessage(message)) return;

      const messageAny = message as AIMessage;
      const messageId = (messageAny.id as string) || `msg-${messageIndex}`;

      // Extract tool calls from AIMessage - check both direct property and kwargs
      let toolCalls: ToolCall[] = [];

      // Check for tool_calls directly on message (SDK format)
      if (messageAny.tool_calls && Array.isArray(messageAny.tool_calls)) {
        toolCalls = messageAny.tool_calls;
      }

      // Extract tool messages (responses) - find ToolMessage type messages
      const toolMessages: Record<string, unknown>[] = [];
      for (const msg of stream.messages) {
        if (isToolMessage(msg)) {
          const msgAny = msg as ToolMessage;
          const toolCallId = msgAny.tool_call_id;

          if (toolCallId && toolCalls.some((tc) => tc.id === toolCallId)) {
            toolMessages.push(msg);
          }
        }
      }

      // Build tool call states
      if (toolCalls.length > 0) {
        const toolCallStates: ToolCallState[] = [];
        for (const toolCall of toolCalls) {
          const toolMessage = toolMessages.find((tm) => {
            const tmAny = tm as Record<string, unknown>;
            const tmToolCallId =
              (tmAny.tool_call_id as string | undefined);
            return tmToolCallId === toolCall.id;
          });

          toolCallStates.push({
            toolCall,
            toolMessage,
            aiMessageId: messageId,
            timestamp: messageIndex * 1000, // Use message index as timestamp for deterministic ordering
          });
        }
        map.set(message, toolCallStates);
      }
    });

    // Sort by timestamp
    for (const [, calls] of map.entries()) {
      calls.sort((a, b) => a.timestamp - b.timestamp);
    }

    return map;
  }, [stream.messages]);

  const handleSend = useCallback(
    (messageOverride?: string) => {
      const messageToSend = messageOverride || "";

      if (!messageToSend.trim() || stream.isLoading) {
        return;
      }

      if (!apiKey.trim()) {
        // Add error message to stream
        return;
      }

      // Submit message using stream API
      stream.submit({
        messages: [{ content: messageToSend, type: "human" }],
      });
    },
    [apiKey, stream]
  );

  const handleInputSubmit = useCallback(
    (message: string) => {
      handleSend(message);
    },
    [handleSend]
  );

  const isLoading = stream.isLoading;
  const errorMessage = stream.error instanceof Error ? stream.error.message : typeof stream.error === "string" ? stream.error : undefined;

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {stream.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <WelcomeScreen apiKey={apiKey} handleSend={handleSend} />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Render messages - filter out tool messages as they're displayed separately */}
            {stream.messages
              .filter((message) => !isToolMessage(message))
              .map((message, messageIndex) => {
                // Get tool calls associated with this AI message
                const associatedToolCalls =
                  isAIMessage(message)
                    ? toolCallsByMessage.get(message) || []
                    : [];

                return (
                  <div key={message.id || messageIndex}>
                    {/* Message */}
                    {extractTextContent(message.content) !== "" && (
                      <div
                        className={`flex ${
                          isHumanMessage(message)
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-3 ${
                            isHumanMessage(message)
                              ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                              : "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">
                            {extractTextContent(message.content)}
                            {messageIndex ===
                              stream.messages.filter((m) => !isToolMessage(m)).length - 1 &&
                              isLoading && (
                                <span className="inline-block w-2 h-4 bg-gray-400 dark:bg-gray-600 ml-1 animate-pulse" />
                              )}
                          </p>
                        </div>
                      </div>
                    )}
                    {/* Tool calls associated with this message */}
                    {associatedToolCalls.map((toolCallState) => (
                      <ToolCallBubble
                        key={toolCallState.toolCall.id}
                        toolCallState={toolCallState}
                      />
                    ))}
                    {/* Error bubble associated with this message */}
                    {errorMessage &&
                      isAIMessage(message) &&
                      messageIndex ===
                        stream.messages.filter((m) => !isToolMessage(m)).length - 1 && (
                        <ErrorBubble error={errorMessage} />
                      )}
                  </div>
                );
              })}
            {isLoading && (
              <div className="flex justify-center items-center gap-1.5 py-2">
                <span
                  className="inline-block w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-dot-wave"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="inline-block w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-dot-wave"
                  style={{ animationDelay: "200ms" }}
                />
                <span
                  className="inline-block w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-dot-wave"
                  style={{ animationDelay: "400ms" }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSubmit={handleInputSubmit} isLoading={isLoading} />
    </div>
  );
}
