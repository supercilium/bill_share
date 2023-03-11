import { FC, ReactNode } from "react";

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
      className={`columns ${containerProps?.className || ""}`}
    >
      {Array.isArray(children) ? (
        children.map((elem, i) => (
          <div
            key={i}
            {...(columnProps || {})}
            className={`column ${columnProps?.className || ""}`}
          >
            {elem}
          </div>
        ))
      ) : (
        <div
          {...(columnProps || {})}
          className={`column ${columnProps?.className || ""}`}
        >
          {children}
        </div>
      )}
    </div>
  ) : null;
};
