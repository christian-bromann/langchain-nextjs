import Image from "next/image";

interface WelcomeScreenProps {
  apiKey: string;
  handleSend: (prompt: string) => void
}

const EXAMPLE_PROMPT = "Who is the customer with the ID 1234567890?";

export function WelcomeScreen({ apiKey, handleSend }: WelcomeScreenProps) {
  // Don't show prompts if API key is not set
  if (!apiKey.trim()) {
    return null;
  }

  return (<>
    <div className="flex flex-col items-center text-center">
      <Image
        src="/langchain.png"
        alt="LangChain Logo"
        width={120}
        height={120}
        className="mb-6"
        priority
      />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Welcome to LangChain Agent Demo
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        A simple demo showcasing LangChain&apos;s <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-900 rounded">createAgent</code> with Next.js.
      </p>
    </div>
    <div className="mt-8 max-w-md mx-auto w-full relative">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 text-center">
        Try this example prompt:
      </p>
      <div className="relative group">
        <button
          onClick={() => {
            handleSend(EXAMPLE_PROMPT);
          }}
          className="text-left px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors w-full cursor-pointer"
        >
          <span className="flex items-start gap-2">
            <span className="text-gray-400 dark:text-gray-500">💡</span>
            <span>{EXAMPLE_PROMPT}</span>
          </span>
        </button>
      </div>
    </div>
  </>)
}
