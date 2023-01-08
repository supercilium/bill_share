import { FC } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

export const Field: FC<{
  label?: string;
  error?: FieldError;
  inputProps: React.InputHTMLAttributes<HTMLInputElement> &
    UseFormRegisterReturn;
}> = ({ label, inputProps, error }) => {
  return (
    <div className="field">
      {label && (
        <label htmlFor={inputProps.name} className="label">
          {label}
        </label>
      )}
      <input className={`input${error ? " is-danger" : ""}`} {...inputProps} />
    </div>
  );
};
