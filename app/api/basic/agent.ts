import { z } from "zod";
import { createAgent, tool, type BaseMessage } from "langchain";
import { ChatAnthropic } from "@langchain/anthropic";
import { MemorySaver } from "@langchain/langgraph";
import type { LangGraphRunnableConfig } from "@langchain/langgraph";

const checkpointer = new MemorySaver();

const customers = {
  "1234567890": {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234-567-8900",
  },
  "1234567891": {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 234-567-8901",
  },
  "1234567892": {
    name: "Jim Doe",
    email: "jim.doe@example.com",
    phone: "+1 234-567-8902",
  },
}

/**
 * Basic agent with no tools, no middleware - just uses a model
 */
export async function basicAgent(options: { input: Record<string, unknown>; apiKey: string; config: LangGraphRunnableConfig }) {
  // Create the Anthropic model instance with user-provided API key
  const model = new ChatAnthropic({
    model: "claude-3-7-sonnet-latest",
    apiKey: options.apiKey,
  });

  const getCustomerInformationTool = tool(
    async (input: { customerId: string }) => {
      return customers[input.customerId as keyof typeof customers];
    },
    {
      name: "get_customer_information",
      description: "Get information about a customer",
      schema: z.object({
        customerId: z.string(),
      }),
    }
  );

  const agent = createAgent({
    model,
    tools: [getCustomerInformationTool],
    checkpointer,
    systemPrompt: "You are a helpful assistant that can get information about customers.",
  });

  const stream = await agent.stream(options.input as {
    messages: BaseMessage[];
  }, {
    encoding: "text/event-stream",
    streamMode: ["values", "updates", "messages"],
    configurable: options.config.configurable,
    recursionLimit: 10,
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}

