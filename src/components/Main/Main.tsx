import { FC, ReactNode } from "react";

export const Main: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="container px-2 mb-6">{children}</div>;
};
