import { FC, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { useUser } from "../../contexts/UserContext";
import { Navbar as NavbarUI } from "../../components/Navbar";
import { fetchLogout } from "../../__api__/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginForm } from "../LoginForm";
import { RegisterForm } from "../RegisterForm";
import { Block } from "../../components";
import { useClickOutside } from "../../hooks/useClickOutside";
import { User } from "../../types/user";
import { Transport } from "../../services/transport";

interface NavbarProps {
  shouldShowAuthButtons?: boolean;
  navbarProps?: {
    isTransparent?: boolean;
    isFixed?: boolean;
    hasShadow?: boolean;
  };
}

export const Navbar: FC<NavbarProps> = ({
  shouldShowAuthButtons = true,
  navbarProps,
}) => {
  const { setUser, user } = useUser();
  const [openedPopup, setOpenedPopup] = useState<
    "login" | "registration" | null
  >(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { refetch } = useQuery(["logout"], () => fetchLogout, {
    retry: false,
    enabled: false,
    onSettled: () => {
      Transport.terminate();
      setUser(null);
      navigate("/");
    },
  });

  const ref = useClickOutside<HTMLDivElement>(() => setOpenedPopup(null));

  const renderUserMenu = useCallback(
    (user: User) => (
      <div className="navbar-item has-dropdown is-hoverable">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className="navbar-link">{user.name}</a>

        <div
          className={`navbar-dropdown${
            navbarProps?.isTransparent ? " is-boxed has-background-dark" : ""
          }`}
        >
          <Link
            to="/profile"
            className={`navbar-item${
              pathname === "/profile" ? " is-active" : ""
            }`}
          >
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
    ),
    [pathname]
  );

  return (
    <>
      <NavbarUI
        NavbarEndItems={
          user ? (
            <>
              {renderUserMenu(user)}
              <div className="buttons is-justify-content-flex-end">
                <button onClick={() => refetch()} className="button is-light">
                  <FontAwesomeIcon
                    className="mr-3"
                    icon="arrow-right-from-bracket"
                  />
                  Log out
                </button>
              </div>
            </>
          ) : (
            shouldShowAuthButtons && (
              <div className="buttons is-justify-content-flex-end">
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
              </div>
            )
          )
        }
        navbarProps={navbarProps}
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
