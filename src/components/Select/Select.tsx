import cx from "classnames";

export interface SelectProps<T> {
  isMultiple?: boolean;
  options: T[];
  disabled?: boolean;
  placeholder?: string;
  getLabel?: (v: T) => string;
  getValue?: (v: T) => string | string[];
}

const defaultGetValue = (v: string) => v;

export const Select = <T extends unknown>(props: SelectProps<T>) => {
  return (
    <div
      className={cx("select full-width", { "is-multiple": props.isMultiple })}
    >
      <select
        className="full-width"
        placeholder={props.placeholder || "standard placeholder"}
        disabled={props.disabled}
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
