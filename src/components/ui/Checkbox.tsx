import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${checkboxId}-error` : undefined;

    return (
      <div className="w-full">
        <div className="flex items-center">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={errorId}
            className={clsx(
              "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded",
              "dark:bg-gray-800 dark:border-gray-600 dark:checked:bg-blue-600",
              error && "border-red-500 dark:border-red-500",
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              {label}
            </label>
          )}
        </div>
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

Checkbox.displayName = "Checkbox";
