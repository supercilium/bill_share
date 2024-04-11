import { ReactNode } from "react";
import { Select, SelectProps } from "../Select/Select";

interface SelectFieldProps<T> extends SelectProps<T> {
  label?: ReactNode;
}

export const SelectField = <T extends unknown>({
  label,
  ...props
}: SelectFieldProps<T>) => {
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      <div className="control full-width">
        <Select<T> {...props} />
      </div>
    </div>
  );
};
