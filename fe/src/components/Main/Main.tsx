import { FC, ReactNode } from "react";

export const Main: FC<{ children: ReactNode }> = ({ children }) => {
  return <main className="container px-6 mb-6">{children}</main>;
};
