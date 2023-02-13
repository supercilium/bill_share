import { FC, ReactNode } from "react";

export const Columns: FC<{ children?: ReactNode[] | ReactNode }> = ({
  children,
}) => {
  return children ? (
    <div className="columns">
      {Array.isArray(children) ? (
        children.map((elem, i) => (
          <div key={i} className="column">
            {elem}
          </div>
        ))
      ) : (
        <div className="column">{children}</div>
      )}
    </div>
  ) : null;
};
