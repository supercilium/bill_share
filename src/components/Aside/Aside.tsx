import { FC, ReactNode } from "react";
import { useUISettings } from "../../contexts/UIsettings";
import { StyledAside } from "./Aside.style";

export const Aside: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAsideVisible } = useUISettings();
  return <StyledAside $isVisible={isAsideVisible}>{children}</StyledAside>;
};
