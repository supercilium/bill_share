import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";

interface NavbarProps {}

export const Navbar: FC<NavbarProps> = (props) => {
  return (
    <nav
      className="navbar is-fixed-top has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <p className="is-size-5 has-text-weight-semibold">
          <a href="/" title="Home page" className="navbar-item">
            <FontAwesomeIcon
              className="mr-3"
              color="rgb(156,26,26)"
              icon="champagne-glasses"
            />
            Party Bill Share
          </a>
        </p>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        {/* <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a> */}
      </div>

      <div className="navbar-menu">
        <div className="navbar-start"></div>

        <div className="navbar-end is-flex-grow-1">
          <div className="navbar-item">
            <div className="buttons">
              {/* <a className="button is-primary">
                <strong>Sign up</strong>
              </a>
              <a className="button is-light">Log in</a> */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
