import { FC, ReactNode } from "react";

export const Columns: FC<{ children: ReactNode[] }> = ({ children }) => {
  return (
    <div className="columns">
      {children.map((elem, i) => (
        <div key={i} className="column">
          {elem}
        </div>
      ))}
    </div>
  );
};
