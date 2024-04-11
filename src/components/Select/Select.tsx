import cx from "classnames";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface SelectProps<T> {
  isMultiple?: boolean;
  options: T[];
  disabled?: boolean;
  placeholder?: string;
  getLabel?: (v: T) => string;
  getValue?: (v: T) => string | string[];
  selectProps?: React.InputHTMLAttributes<HTMLSelectElement> &
    Partial<UseFormRegisterReturn>;
}

const defaultGetValue = (v: string) => v;

export const Select = <T extends unknown>(props: SelectProps<T>) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx("select is-fullwidth", { "is-multiple": props.isMultiple })}
    >
      <select
        className="full-width"
        multiple={props.isMultiple}
        size={props.options.length}
        placeholder={props.placeholder || t("PLACEHOLDER_SELECT")}
        disabled={props.disabled}
        onChange={props.selectProps?.onChange}
        value={props.selectProps?.value}
      >
        {props.options.length ? (
          props.options.map((option, i) => {
            const getLabel = props.getLabel
              ? props.getLabel
              : () => defaultGetValue(option as string);
            const getValue = props.getValue
              ? props.getValue
              : () => defaultGetValue(option as string);

            return (
              <option value={getValue(option)} key={i}>
                {getLabel(option)}
              </option>
            );
          })
        ) : (
          <p>no options</p>
        )}
      </select>
    </div>
  );
};
