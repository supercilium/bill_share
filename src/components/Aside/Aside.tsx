import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, ReactNode } from "react";
import { useUISettings } from "../../contexts/UIsettings";

export const Aside: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAsideVisible, setAsideVisibility } = useUISettings();
  return (
    <>
      {!isAsideVisible && (
        <div style={{ position: "absolute", left: 0 }}>
          <nav
            className="icon m-4"
            aria-label="menu"
            onClick={() => setAsideVisibility(true)}
          >
            <FontAwesomeIcon icon="bars" size="2xl" />
          </nav>
        </div>
      )}
      <aside
        style={{
          position: "absolute",
          left: 0,
          right: "20%",
          transform: `translateX(${isAsideVisible ? 0 : "-100%"})`,
          transition: "transform .3s ease .2s",
        }}
      >
        {children}
      </aside>
    </>
  );
};
