import { FC, ReactNode } from "react";

export const Columns: FC<{ children: ReactNode[] }> = ({ children }) => {
  return (
    <div className="columns">
      {children.map((elem) => (
        <div className="column">{elem}</div>
      ))}
    </div>
  );
};
