import { z } from "zod";
import { createAgent, tool, type BaseMessage } from "langchain";
import type { LangGraphRunnableConfig } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

type DB_URI = string | undefined;

const DB_URI: DB_URI = process.env.NEXT_PUBLIC_DB_URI;
if (!DB_URI) {
  throw new Error("Missing NEXT_PUBLIC_DB_URI");
}

const checkpointer = PostgresSaver.fromConnString(DB_URI);

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
  const model = new ChatOpenAI({
    model: "nvidia/nemotron-3-nano-30b-a3b:free",
    apiKey: options.apiKey,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
    },
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

