import { FC, ReactNode } from "react";
import { useUISettings } from "../../contexts/UIsettings";
import { useClickOutside } from "../../hooks/useClickOutside";
import { StyledAside } from "./Aside.style";

export const Aside: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAsideVisible, setAsideVisibility } = useUISettings();
  const ref = useClickOutside<HTMLDivElement>(() => setAsideVisibility(false));

  return (
    <StyledAside ref={ref} $isVisible={isAsideVisible}>
      {children}
    </StyledAside>
  );
};
