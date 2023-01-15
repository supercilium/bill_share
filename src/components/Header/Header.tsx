import { FC, ReactNode } from "react";

export const Header: FC<{ children: ReactNode }> = ({ children }) => {
  return <header className="container my-5 px-6">{children}</header>;
};
