import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";

interface NavbarProps {
  MobileVisibleItems?: React.ReactNode;
  NavbarStartItems?: React.ReactNode;
  NavbarEndItems?: React.ReactNode;
}

export const Navbar: FC<NavbarProps> = ({
  MobileVisibleItems,
  NavbarStartItems,
  NavbarEndItems,
}) => {
  return (
    <nav
      className="navbar is-fixed-top has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand is-justify-content-space-between">
        <a href="/" title="Home page" className="navbar-item">
          <span className="is-size-5 has-text-weight-semibold">
            <FontAwesomeIcon
              className="mr-3"
              color="rgb(156,26,26)"
              icon="champagne-glasses"
            />
            Party Bill Share
          </span>
        </a>
        {MobileVisibleItems}
        {/* {(NavbarEndItems || NavbarStartItems) && (
          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        )} */}
      </div>

      <div className="navbar-menu">
        <div className="navbar-start">{NavbarStartItems}</div>

        <div className="navbar-end is-flex-grow-1">
          <div className="navbar-item">
            <div className="buttons">{NavbarEndItems}</div>
          </div>
        </div>
      </div>
    </nav>
  );
};
