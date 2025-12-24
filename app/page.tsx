"use client";

import { useState } from "react";
import ChatInterface from "./components/ChatInterface";

export default function Home() {
  const [apiKey, setApiKey] = useState<string>(process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ?? "");

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black">
      <>
        {/* Chat Interface - Show when API key is set */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatInterface apiKey={apiKey} />
        </main>
      </>
    </div>
  );
}
