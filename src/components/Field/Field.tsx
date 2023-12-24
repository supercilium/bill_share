import React, { FC } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import cx from "classnames";

const getBulmaInputClassName = (
  type: React.InputHTMLAttributes<HTMLInputElement>["type"]
) => {
  switch (type) {
    case "text":
    case "password":
    case "email":
    case "number":
    case undefined:
      return "input";
    default:
      return type;
  }
};

const getBulmaLabelClassName = (
  type: React.InputHTMLAttributes<HTMLInputElement>["type"]
) => {
  switch (type) {
    case "text":
    case "number":
    case "password":
    case "email":
    case undefined:
      return "label";
    default:
      return type;
  }
};

export const Field: FC<{
  label?: string;
  labels?: string[];
  error?: FieldError;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputProps: React.InputHTMLAttributes<HTMLInputElement> &
    Partial<UseFormRegisterReturn>;
}> = ({ label, labels, inputProps, error, onEnter }) => {
  const { type } = inputProps;
  const classNameInput = getBulmaInputClassName(type);
  const classNameLabel = getBulmaLabelClassName(type);

  if (type === "radio" && Array.isArray(inputProps.value)) {
    return (
      <div className={cx("field")}>
        <div className={cx("control")}>
          {inputProps.value.map((value, i) => (
            <React.Fragment key={value}>
              {labels && (
                <label className={cx(classNameLabel, "mr-2")}>
                  <input {...inputProps} value={value} />
                  {labels?.[i]}
                </label>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className={cx("field")}>
      {label && type !== "checkbox" && (
        <label htmlFor={inputProps.name} className={cx(classNameLabel)}>
          {label}
        </label>
      )}
      <div className={cx("control")}>
        {(!label || type !== "checkbox") && (
          <input
            className={cx(classNameInput, { "is-danger": error })}
            onKeyUp={(e) => e.key === "Enter" && onEnter && onEnter(e)}
            id={inputProps.name}
            {...inputProps}
          />
        )}
        {label && type === "checkbox" && (
          <label className={cx(classNameLabel)}>
            <input
              className={cx(classNameInput, { "is-danger": error })}
              {...inputProps}
            />
            {label}
          </label>
        )}
      </div>
      {error?.message && (
        <p className={cx("help", "is-danger")}>{error?.message}</p>
      )}
    </div>
  );
};
