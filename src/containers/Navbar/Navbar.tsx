import { FC, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { Navbar as NavbarUI } from "../../components/Navbar";
import { fetchLogout } from "../../__api__/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginForm } from "../LoginForm";
import { RegisterForm } from "../RegisterForm";
import { Block } from "../../components";
import { socketClient } from "../../__api__/socket";
import { useClickOutside } from "../../hooks/useClickOutside";

interface NavbarProps {
  shouldShowAuthButtons?: boolean;
}

export const Navbar: FC<NavbarProps> = ({ shouldShowAuthButtons = true }) => {
  const { setUser, user } = useUser();
  const [openedPopup, setOpenedPopup] = useState<
    "login" | "registration" | null
  >(null);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await fetchLogout();
    } catch (err) {
      console.error(err);
    }
    socketClient?.disconnect();
    setUser(null);
    navigate("/");
  };
  const ref = useClickOutside<HTMLDivElement>(() => setOpenedPopup(null));

  return (
    <>
      <NavbarUI
        MobileVisibleItems={
          user && (
            <div className="navbar-item is-hidden-desktop">
              <p className="button is-link is-rounded">{user.name}</p>
              <button
                onClick={() => handleLogout()}
                className="button is-link is-inverted"
              >
                <FontAwesomeIcon
                  className="mr-3"
                  icon="arrow-right-from-bracket"
                />
                Log out
              </button>
            </div>
          )
        }
        NavbarEndItems={
          user ? (
            <>
              {/* <p className="button is-link is-rounded">{user.name}</p> */}
              <div className="navbar-item has-dropdown is-hoverable mb-2">
                <a className="navbar-link">{user.name}</a>

                <div className="navbar-dropdown">
                  <Link to="/profile" className="navbar-item">
                    Profile
                  </Link>
                  {/* <a className="navbar-item">Stats</a> */}
                  <hr className="navbar-divider" />
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="navbar-item"
                    href="https://github.com/supercilium/bill_share/issues"
                  >
                    Report an issue
                  </a>
                </div>
              </div>
              <button
                onClick={() => handleLogout()}
                className="button is-light"
              >
                <FontAwesomeIcon
                  className="mr-3"
                  icon="arrow-right-from-bracket"
                />
                Log out
              </button>
            </>
          ) : (
            shouldShowAuthButtons && (
              <>
                <button
                  onClick={() => setOpenedPopup("registration")}
                  className="button is-primary"
                >
                  <strong>Sign up</strong>
                </button>
                <button
                  onClick={() => setOpenedPopup("login")}
                  className="button is-light"
                >
                  Sign in
                </button>
              </>
            )
          )
        }
      />
      {openedPopup && (
        <div className={`modal${openedPopup ? " is-active" : ""}`}>
          <div className="modal-background"></div>
          <div ref={ref} className="modal-content">
            <div className="box">
              <div className="tabs is-large">
                <ul>
                  <li className={openedPopup === "login" ? "is-active" : ""}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a role="button" onClick={() => setOpenedPopup("login")}>
                      Log in
                    </a>
                  </li>
                  <li
                    className={
                      openedPopup === "registration" ? "is-active" : ""
                    }
                  >
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => setOpenedPopup("registration")}>
                      Register
                    </a>
                  </li>
                </ul>
              </div>

              {openedPopup === "login" ? (
                <Block title="Log in">
                  <LoginForm onLogin={() => setOpenedPopup(null)} />
                </Block>
              ) : (
                <Block title="Registration">
                  <RegisterForm onRegister={() => setOpenedPopup(null)} />
                </Block>
              )}
            </div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={() => setOpenedPopup(null)}
          ></button>
        </div>
      )}
    </>
  );
};
