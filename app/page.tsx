"use client";

import { useState } from "react";
import ChatInterface from "./components/ChatInterface";
import { ApiKeyInput } from "./components/ApiKeyInput";

export default function Home() {
  const [apiKey, setApiKey] = useState<string>(process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ?? "");

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black">
      {!apiKey.trim() ? (
        /* API Key Input - Show when no API key is set */
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Welcome to LangChain Agent Demo
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Enter your Anthropic API key to get started
              </p>
            </div>
            <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />
          </div>
        </div>
      ) : (
        <>
          {/* Chat Interface - Show when API key is set */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <ChatInterface apiKey={apiKey} />
          </main>
        </>
      )}
    </div>
  );
}
