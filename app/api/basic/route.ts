import { NextRequest } from "next/server";
import { basicAgent } from "./agent";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    if (!body.apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing API key" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get the agent stream
    return basicAgent(body);
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

