import { type ReactNode } from "react";

type InputProps = {
  id?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  endAdornment?: ReactNode;
};

export function Input({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  hint,
  disabled = false,
  required = false,
  autoComplete,
  className = "",
  endAdornment
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`w-full ${className}`}>
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-200"
        >
          {label}
          {required ? <span className="ml-1 text-slate-400">*</span> : null}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={[
            "w-full rounded-xl border bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500",
            "outline-none transition-colors",
            "focus:border-accent focus:ring-2 focus:ring-accent/20",
            error ? "border-rose-500/80 focus:border-rose-400" : "border-slate-600",
            disabled ? "opacity-60 cursor-not-allowed" : "",
            endAdornment ? "pr-10" : ""
          ].join(" ")}
        />
        {endAdornment ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            {endAdornment}
          </div>
        ) : null}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-400" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}
