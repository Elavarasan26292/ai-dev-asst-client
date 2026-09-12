import { type InputHTMLAttributes } from "react";
import FormError from "../FormError/FormError";
import "./Input.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="input-wrapper">
      <label htmlFor={inputId} className="input-label">
        {label}
      </label>
      <input
        id={inputId}
        className={`input-field ${
          error ? "input-field--error" : ""
        } ${className}`}
        {...props}
      />
      <FormError message={error ?? null} />
    </div>
  );
}
