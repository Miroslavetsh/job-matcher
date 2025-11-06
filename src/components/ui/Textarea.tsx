import { TextareaHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${textareaId}-error` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={errorId}
          className={clsx(
            "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[100px]",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            error
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 dark:border-gray-600",
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
