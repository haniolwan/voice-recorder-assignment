import { ErrorSvg } from "@/app/assets/error";
import React, { forwardRef } from "react";

type InputProps = {
  id: string;
  value?: string | number;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | undefined;
  loading?: boolean;
  placeholder?: string | undefined;
  type?: string | undefined;
  inputName?: string;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
  ariaLabel?: string;
};

const Input = ({
  id,
  value,
  handleInputChange,
  error,
  loading,
  placeholder,
  type,
  inputName = "",
  disabled,
  className,
  autoComplete,
  ariaLabel,
}: InputProps) => {
  return (
    <div className="relative h-full">
      <input
        id={id}
        name={inputName}
        type={type ? type : "text"}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`${
          error ? "!border-red-500" : "border-gray-300"
        } border border-solid border-gray-300 rounded-lg text-base px-3.5 py-2.5 w-full shadow-sm focus:!border-sky-500 focus:outline-none text-md-responsive text-gray-900 font-normal placeholder-gray-500 mt-1.5 mb-0 ${className}`}
        disabled={disabled ?? loading}
        autoComplete={autoComplete}
        aria-label={ariaLabel}
      />
      {error && (
        <>
          <div className="absolute right-2.5 top-5">
            <ErrorSvg height={16} width={16} />
          </div>
        </>
      )}
      {error && (
        <p className="text-red-500 text-sm-responsive mt-1.5">{error}</p>
      )}
    </div>
  );
};

Input.displayName = "Input";

export default Input;
