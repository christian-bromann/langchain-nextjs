"use client";

import { useState } from "react";

/**
 * Props for the ApiKeyInput component.
 *
 * @interface ApiKeyInputProps
 */
interface ApiKeyInputProps {
  /**
   * The current API key value.
   * This is used as the initial value for the local input state.
   */
  apiKey: string;

  /**
   * Callback function that is called when the user submits a valid API key.
   * The key is automatically trimmed of whitespace before being passed to this callback.
   *
   * @param key - The trimmed API key entered by the user
   */
  onApiKeyChange: (key: string) => void;
}

/**
 * A form component for securely inputting and submitting an Anthropic API key.
 *
 * This component provides a secure API key input interface with the following features:
 * - Password-masked input field (type="password")
 * - Local state management (doesn't update parent until submission)
 * - Form validation (submit button disabled for empty input)
 * - Interactive tooltip with security information
 * - Dark mode support
 * - Accessibility features (aria-label, proper form labels)
 * - Password manager integration prevention (data-1p-ignore, autoComplete="off")
 *
 * The component uses local state to manage the input value independently from the parent,
 * only updating the parent component when the form is explicitly submitted. This prevents
 * the API key from being updated on every keystroke.
 *
 * Security considerations:
 * - API key is stored only in local component state and browser memory
 * - Input is masked using password type
 * - Tooltip warns users about security best practices
 * - Password managers are disabled for this field
 *
 * @example
 * ```tsx
 * function SettingsPage() {
 *   const [apiKey, setApiKey] = useState("");
 *
 *   const handleApiKeyChange = (key: string) => {
 *     setApiKey(key);
 *     // Optionally save to localStorage or send to server
 *     localStorage.setItem("anthropic_api_key", key);
 *   };
 *
 *   return <ApiKeyInput apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />;
 * }
 * ```
 *
 * @param props - The component props
 * @returns A form component for API key input with security tooltip
 */
export function ApiKeyInput({ apiKey, onApiKeyChange }: ApiKeyInputProps) {
  // State to control tooltip visibility (shown on hover over info icon)
  const [showTooltip, setShowTooltip] = useState(false);

  // Local state for the input value
  // This is separate from the prop to allow editing without immediately updating parent
  // The parent is only updated when the form is submitted
  const [localApiKey, setLocalApiKey] = useState(apiKey);

  /**
   * Handles form submission when the user clicks the submit button or presses Enter.
   *
   * Prevents default form submission behavior and validates that the input is not empty.
   * If valid, calls the `onApiKeyChange` callback with the trimmed API key.
   *
   * The form submission is the only way to update the parent component's API key state,
   * providing a controlled update mechanism rather than updating on every keystroke.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only update parent if input is not empty after trimming
    if (localApiKey.trim()) {
      onApiKeyChange(localApiKey.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Anthropic API Key
          <button
            type="button"
            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-label="API key information"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          </button>

          {showTooltip && (
            <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
              <p className="font-semibold mb-1">Security Notice</p>
              <p className="mb-2">
                Please use a throwaway API key and revoke it after using this app. Even though logs are not monitored, the raw key may still be collected in server logs.
              </p>
              <p className="text-gray-400">
                Your API key is stored locally in your browser and never persisted on the server.
              </p>
            </div>
          )}
        </label>
        <div className="flex gap-2">
          <input
            id="api-key"
            type="password"
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
            placeholder="sk-ant-..."
            autoComplete="off"
            data-1p-ignore
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 text-sm"
          />
          <button
            type="submit"
            disabled={!localApiKey.trim()}
            className="px-6 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit
          </button>
        </div>
    </form>
  );
}

