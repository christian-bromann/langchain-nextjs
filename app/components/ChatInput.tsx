"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Props for the ChatInput component.
 *
 * @interface ChatInputProps
 */
interface ChatInputProps {
  /**
   * Callback function that is called when the user submits a message.
   * The message is automatically trimmed of whitespace before being passed to this callback.
   *
   * @param message - The trimmed message text entered by the user
   */
  onSubmit: (message: string) => void;

  /**
   * Whether the input is in a loading state (e.g., while sending a message).
   * When true, the submit button is disabled and shows "Sending..." text.
   *
   * @default false
   */
  isLoading?: boolean;

  /**
   * Placeholder text displayed in the textarea when it's empty.
   *
   * @default "Type your message..."
   */
  placeholder?: string;
}

/**
 * A reusable chat input component with auto-resizing textarea and submit functionality.
 *
 * This component provides a modern chat input interface with the following features:
 * - Auto-resizing textarea that grows with content (up to 200px max height)
 * - Submit button that syncs its height with the textarea
 * - Enter key to submit (Shift+Enter for new line)
 * - Loading state support with disabled submit button
 * - Dark mode support
 *
 * The component manages its own input state internally and only calls the `onSubmit`
 * callback when a valid (non-empty) message is submitted.
 *
 * @example
 * ```tsx
 * function ChatInterface() {
 *   const [isLoading, setIsLoading] = useState(false);
 *
 *   const handleSubmit = async (message: string) => {
 *     setIsLoading(true);
 *     try {
 *       await sendMessage(message);
 *     } finally {
 *       setIsLoading(false);
 *     }
 *   };
 *
 *   return <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />;
 * }
 * ```
 *
 * @param props - The component props
 * @returns A chat input component with textarea and submit button
 */
export function ChatInput({
  onSubmit,
  isLoading = false,
  placeholder = "Type your message...",
}: ChatInputProps) {
  // Local state for the input value
  const [inputValue, setInputValue] = useState("");

  // Refs for DOM manipulation (auto-resize functionality)
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /**
   * Auto-resize the textarea based on content and sync button height.
   *
   * This effect runs whenever the input value changes. It:
   * 1. Resets the textarea height to minimum (52px)
   * 2. Calculates the scroll height needed for the content
   * 3. Sets the height to the calculated value (capped at 200px max)
   * 4. Synchronizes the submit button height to match the textarea
   *
   * This creates a smooth auto-resizing experience where the textarea grows
   * as the user types multi-line content, and the button stays aligned.
   */
  useEffect(() => {
    if (textareaRef.current) {
      // Reset to auto height to get accurate scrollHeight measurement
      // Using 'auto' prevents the scroll position from resetting to top unlike a fixed small pixel value
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;

      // Cap maximum height at 200px
      const newHeight = Math.min(scrollHeight, 200);

      textareaRef.current.style.height = `${newHeight}px`;

      // Allow scrolling only if content exceeds max height
      textareaRef.current.style.overflowY = scrollHeight > 200 ? "auto" : "hidden";

      // Sync button height to match textarea's actual rendered height
      // This ensures visual alignment even when textarea resizes
      if (buttonRef.current) {
        const height = textareaRef.current.offsetHeight;
        buttonRef.current.style.height = `${height}px`;
      }
    }
  }, [inputValue]);

  /**
   * Handles form submission when the user clicks the submit button or presses Enter.
   *
   * Validates that:
   * - The input is not empty (after trimming whitespace)
   * - The component is not in a loading state
   *
   * If valid, calls the `onSubmit` callback with the trimmed message and clears the input.
   */
  const handleSubmit = useCallback(() => {
    // Prevent submission if input is empty or component is loading
    if (!inputValue.trim() || isLoading) {
      return;
    }

    // Call the parent's onSubmit handler with trimmed message
    onSubmit(inputValue.trim());
    // Clear the input after successful submission
    setInputValue("");
  }, [inputValue, isLoading, onSubmit]);

  /**
   * Handles keyboard events in the textarea.
   *
   * Enter key submits the message (calls handleSubmit).
   * Shift+Enter creates a new line (default textarea behavior).
   *
   * This provides a natural chat-like experience where users can quickly
   * send messages with Enter, but can still create multi-line messages
   * when needed.
   */
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Submit on Enter (but not Shift+Enter, which creates a new line)
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto px-6 py-[14px]">
        <div className="flex items-start gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              rows={1}
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 resize-none overflow-hidden"
              style={{
                minHeight: "52px", // Initial height matches button
                maxHeight: "200px", // Maximum height before scrolling (synced with useEffect logic)
              }}
            />
          </div>
          <button
            ref={buttonRef}
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            style={{
              height: "52px", // Initial height, synced dynamically via useEffect
            }}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

