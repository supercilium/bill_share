import { FC, ReactNode } from "react";
import { useUISettings } from "../../contexts/UIsettings";
import { useClickOutside } from "../../hooks/useClickOutside";
import "./Aside.scss";

export const Aside: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAsideVisible, setAsideVisibility } = useUISettings();
  const ref = useClickOutside<HTMLDivElement>(() => setAsideVisibility(false));

  return (
    <aside
      ref={ref}
      className={`aside-menu${isAsideVisible ? " visible" : ""}`}
    >
      {children}
    </aside>
  );
};
