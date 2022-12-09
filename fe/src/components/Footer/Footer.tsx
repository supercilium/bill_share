import { FC, ReactNode } from "react";

export const Footer: FC<{ children: ReactNode }> = ({ children }) => {
  return <footer className="footer">{children}</footer>;
};
