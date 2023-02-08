import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../contexts/UserContext";
import { fetchLogout } from "../../__api__/auth";

interface NavbarProps {}

export const Navbar: FC<NavbarProps> = (props) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await fetchLogout();
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    navigate("/");
  };

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
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a
          onClick={() => handleLogout()}
          className="navbar-item is-hidden-desktop"
        >
          <FontAwesomeIcon className="mr-3" icon="arrow-right-from-bracket" />
          Log out
        </a>

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
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a onClick={() => handleLogout()} className="button is-light">
                <FontAwesomeIcon
                  className="mr-3"
                  icon="arrow-right-from-bracket"
                />
                Log out
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
