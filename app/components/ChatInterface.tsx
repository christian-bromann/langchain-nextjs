"use client";

import { useCallback, useMemo } from "react";
import { type Message } from "@langchain/langgraph-sdk";
import { useStream, FetchStreamTransport } from "@langchain/langgraph-sdk/react";
import { AIMessage, ToolCall, ToolMessage } from "@langchain/core/messages";

import { WelcomeScreen } from "./Welcome";
import { ToolCallBubble, type ToolCallState } from "./ToolCall";
import { ErrorBubble } from "./ErrorBubble";
import { ChatInput } from "./ChatInput";
import { isAIMessage, isToolMessage, isHumanMessage, extractTextContent } from "../utils";

interface ChatInterfaceProps {
  apiKey: string;
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
    const map = new Map<Message, ToolCallState[]>();

    stream.messages.forEach((message) => {
      // Only process AI messages (check both SDK format and LangChain Core format)
      if (!isAIMessage(message)) {
        return
      };

      const aiMessage = message as AIMessage;

      // Extract tool calls from AIMessage - check both direct property and kwargs
      let toolCalls: ToolCall[] = [];

      // Check for tool_calls directly on message (SDK format)
      if (aiMessage.tool_calls && Array.isArray(aiMessage.tool_calls)) {
        toolCalls = aiMessage.tool_calls as ToolCall[];
      }

      // Extract tool messages (responses) - find ToolMessage type messages
      const toolMessages: ToolMessage[] = [];
      for (const msg of stream.messages) {
        if (isToolMessage(msg)) {
          const toolMessage = msg as ToolMessage;
          const toolCallId = toolMessage.tool_call_id;

          if (toolCallId && toolCalls.some((tc) => tc.id === toolCallId)) {
            toolMessages.push(msg as ToolMessage);
          }
        }
      }

      // Build tool call states
      if (toolCalls.length > 0) {
        const toolCallStates: ToolCallState[] = [];
        for (const toolCall of toolCalls) {
          const toolMessage = toolMessages.find((tm) => {
            return tm.tool_call_id === toolCall.id;
          });

          toolCallStates.push({
            toolCall,
            toolMessage,
          });
        }
        map.set(message, toolCallStates);
      }
    });

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
