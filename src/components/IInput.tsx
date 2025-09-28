import React, { InputHTMLAttributes } from "react";
import { X } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  errorMessage?: string;
  value: string;
  clearText: () => void;
}

export const IInput: React.FC<InputProps> = ({
  type = "text",
  placeholder = "Enter text",
  className = "",
  errorMessage = "",
  value,
  clearText,
  ...props
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <div className="relative w-full">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          className={`px-4 py-2 w-full rounded border-2 shadow-md transition focus:outline-none focus:ring-0 focus:shadow-xs ${
            props["aria-invalid"]
              ? "border-destructive text-destructive shadow-xs shadow-destructive"
              : "border-border"
          } ${className}`}
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={clearText}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 mr-1"
          >
            <X size={16} color="red" />
          </button>
        )}
      </div>
      {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
    </div>
  );
};
