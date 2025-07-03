import { forwardRef, useState } from "react";

interface IProps {
  value: string;
  onChange: (value: string) => void;
  clearAmount?: () => void;
  label: string;
  errorMessage?: string;
  isError: boolean;
  inputMode?:
    | "numeric"
    | "search"
    | "text"
    | "email"
    | "tel"
    | "url"
    | "none"
    | "password"
    | "decimal";
}

const Input = forwardRef<HTMLInputElement, IProps>(
  (
    { label, value, onChange, errorMessage, isError, inputMode = "numeric" },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = !!value;
    return (
      <div>
        <div className="relative w-full mt-2">
          <input
            ref={ref}
            type={inputMode === "password" ? "password" : "text"}
            inputMode={inputMode === "password" ? "text" : inputMode}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`block w-full h-[52px] px-4 py-2 border ${
              isFocused && !errorMessage
                ? "border-green-800"
                : errorMessage || isError
                  ? "border-red-500"
                  : "border-gray-300"
            } rounded-md focus:outline-none text-md font-bold`}
          />
          <label
            className={`absolute left-3 transition-all duration-200 ease-in-out pointer-events-none ${
              isFocused || hasValue
                ? "top-[-8px] text-xs z-10 dark:bg-[var(--foreground)] bg-[var(--background)] px-1"
                : "top-1/2 transform -translate-y-1/2 text-gray-400"
            } ${errorMessage || (isError && "text-red-500")}`}
          >
            {label}
          </label>
        </div>
        {errorMessage && (
          <div className="text-red-500 text-left mt-2 text-xs">
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "InputWithPlaceholder";

export default Input;
