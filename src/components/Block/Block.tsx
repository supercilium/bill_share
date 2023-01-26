import { FC, ReactNode } from "react";

export const Block: FC<{ title?: ReactNode; children: ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="block">
      {title ? <h3 className="title is-4 my-2">{title}</h3> : null}
      {children}
    </div>
  );
};
