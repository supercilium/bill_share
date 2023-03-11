import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useState } from "react";
import "./Navbar.scss";

interface NavbarProps {
  NavbarStartItems?: React.ReactNode;
  NavbarEndItems?: React.ReactNode;
  navbarProps?: {
    isTransparent?: boolean;
    isFixed?: boolean;
    hasShadow?: boolean;
  };
}

export const Navbar: FC<NavbarProps> = ({
  NavbarStartItems,
  NavbarEndItems,
  navbarProps,
}) => {
  const [isOpened, setIsOpen] = useState(false);
  const navbarClassName = `${navbarProps?.hasShadow ? " has-shadow" : ""}${
    navbarProps?.isTransparent ? " is-transparent" : ""
  }`;

  return (
    <div className={navbarProps?.isFixed ? "sticky-navbar" : ""}>
      <nav
        className={`navbar${navbarClassName || ""}`}
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand is-justify-content-space-between">
          <a href="/" title="Home page" className="navbar-item">
            <span className="is-size-5 has-text-weight-semibold">
              <FontAwesomeIcon
                className="mr-3"
                color={
                  navbarProps?.isTransparent
                    ? "rgb(255,255,255)"
                    : "rgb(156,26,26)"
                }
                icon="champagne-glasses"
              />
              Party Bill Share
            </span>
          </a>
          {(NavbarEndItems || NavbarStartItems) && (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
              role="button"
              className={`navbar-burger${isOpened ? "  is-active" : ""}`}
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          )}
        </div>

        <div className={`navbar-menu${isOpened ? "  is-active" : ""}`}>
          <div className="navbar-start">{NavbarStartItems}</div>

          <div className="navbar-end">
            <div className="navbar-item">{NavbarEndItems}</div>
          </div>
        </div>
      </nav>
    </div>
  );
};
