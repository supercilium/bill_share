import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export const Field: FC<{
  label: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement> &
    UseFormRegisterReturn;
}> = ({ label, inputProps }) => {
  return (
    <div className="field">
      <label htmlFor={inputProps.name} className="label">
        {label}
      </label>
      <input className="input" {...inputProps} />
    </div>
  );
};
