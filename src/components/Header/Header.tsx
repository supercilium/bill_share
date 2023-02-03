import { FC, ReactNode } from "react";

export const Header: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <header className="container px-2 my-5 is-flex-grow-0">{children}</header>
  );
};
