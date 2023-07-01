import { FC, ReactNode } from "react";
import cx from "classnames";
import { useUISettings } from "../../contexts/UIsettings";
import { useClickOutside } from "../../hooks/useClickOutside";
import "./Aside.scss";

export const Aside: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAsideVisible, setAsideVisibility } = useUISettings();
  const ref = useClickOutside<HTMLDivElement>(() => setAsideVisibility(false));

  return (
    <aside ref={ref} className={cx("aside-menu", { visible: isAsideVisible })}>
      {children}
    </aside>
  );
};
