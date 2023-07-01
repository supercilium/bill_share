import { FC, ReactNode } from "react";
import cx from "classnames";

interface Props {
  children?: ReactNode[] | ReactNode;
  containerProps?: React.AllHTMLAttributes<HTMLDivElement>;
  columnProps?: React.AllHTMLAttributes<HTMLDivElement>;
}

export const Columns: FC<Props> = ({
  children,
  columnProps,
  containerProps,
}) => {
  return children ? (
    <div
      {...(containerProps || {})}
      className={cx("columns", containerProps?.className)}
    >
      {Array.isArray(children) ? (
        children.map((elem, i) => (
          <div
            key={i}
            {...(columnProps || {})}
            className={cx("column", columnProps?.className || "")}
          >
            {elem}
          </div>
        ))
      ) : (
        <div
          {...(columnProps || {})}
          className={cx("column", columnProps?.className || "")}
        >
          {children}
        </div>
      )}
    </div>
  ) : null;
};
