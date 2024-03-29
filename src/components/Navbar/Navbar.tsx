import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useEffect, useState } from "react";
import cx from "classnames";
import "./Navbar.scss";
import { Link, useLocation } from "react-router-dom";

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
  // TODO move to context
  const [isOpened, setIsOpen] = useState(false);
  const navbarClassName = `${navbarProps?.hasShadow ? " has-shadow" : ""}${
    navbarProps?.isTransparent ? " is-transparent" : ""
  }`;
  const { pathname } = useLocation();

  useEffect(() => {
    if (isOpened) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className={cx({ "sticky-navbar": navbarProps?.isFixed })}>
      <nav
        className={cx(`navbar${navbarClassName || ""}`)}
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand is-justify-content-space-between">
          <Link to="/" title="Home page" className="navbar-item">
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
              Bill share
            </span>
          </Link>
          {(NavbarEndItems || NavbarStartItems) && (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
              role="button"
              className={cx("navbar-burger", { "is-active": isOpened })}
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

        <div className={cx("navbar-menu", { "is-active": isOpened })}>
          <div className="navbar-start">{NavbarStartItems}</div>

          <div className="navbar-end">
            <div className="navbar-item">{NavbarEndItems}</div>
          </div>
        </div>
      </nav>
    </div>
  );
};
