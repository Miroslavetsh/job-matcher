"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import PhoneInputWithCountry from "react-phone-number-input";
import type { Value } from "react-phone-number-input";

import "react-phone-number-input/style.css";

type PhoneInputProps = {
  id?: string;
  label?: string;
  error?: string;
  value?: Value;
  onChange?: (value: Value | undefined) => void;
  className?: string;
  placeholder?: string;
};

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, className = "", value, onChange, id, ...props }, ref) => {
    const phoneId = id || `phone-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${phoneId}-error` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={phoneId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <PhoneInputWithCountry
          {...props}
          id={phoneId}
          value={value}
          onChange={(val) => onChange?.(val)}
          international
          defaultCountry="US"
          limitMaxLength
          aria-invalid={error ? "true" : "false"}
          aria-describedby={errorId}
          className={clsx(
            "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            error
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 dark:border-gray-600"
          )}
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

PhoneInput.displayName = "PhoneInput";
