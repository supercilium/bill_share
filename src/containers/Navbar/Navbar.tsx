import { FC, useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { useQuery } from "react-query";
import cx from "classnames";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const { setUser, user } = useUser();
  const [openedPopup, setOpenedPopup] = useState<
    "login" | "registration" | null
  >(null);
  const navigate = useNavigate();

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

  const handleSuccess = () => {
    setOpenedPopup(null);
    navigate("/dashboard");
  };

  const renderUserMenu = useCallback(
    (user: User) => (
      <div className="navbar-item has-dropdown is-hoverable">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className="navbar-link">{user.name}</a>

        <div
          className={cx("navbar-dropdown", {
            "is-boxed has-background-dark": navbarProps?.isTransparent,
          })}
        >
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              cx("navbar-item", {
                "is-active": isActive,
              })
            }
          >
            {t("LINK_DASHBOARD")}
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cx("navbar-item", {
                "is-active": isActive,
              })
            }
          >
            {t("LINK_MY_ACCOUNT")}
          </NavLink>
          {/* <a className="navbar-item">Stats</a> */}
          <hr className="navbar-divider" />
          <a
            target="_blank"
            rel="noreferrer"
            className="navbar-item"
            href="https://github.com/supercilium/bill_share/issues"
          >
            {t("LINK_REPORT_ISSUE")}
          </a>
        </div>
      </div>
    ),
    [navbarProps?.isTransparent, t]
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
                  {t("BUTTON_LOG_OUT")}
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
                  <strong>{t("BUTTON_SIGN_UP")}</strong>
                </button>
                <button
                  onClick={() => setOpenedPopup("login")}
                  className="button is-light"
                >
                  {t("BUTTON_SIGN_IN")}
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
            <div className="box has-background-white">
              <div className="tabs is-large">
                <ul>
                  <li className={cx({ "is-active": openedPopup === "login" })}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a role="button" onClick={() => setOpenedPopup("login")}>
                      {t("BUTTON_LOG_IN")}
                    </a>
                  </li>
                  <li
                    className={cx({
                      "is-active": openedPopup === "registration",
                    })}
                  >
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => setOpenedPopup("registration")}>
                      {t("BUTTON_REGISTER")}
                    </a>
                  </li>
                </ul>
              </div>

              {openedPopup === "login" ? (
                <Block>
                  <LoginForm
                    closePopup={() => setOpenedPopup(null)}
                    onLogin={handleSuccess}
                  />
                </Block>
              ) : (
                <Block>
                  <RegisterForm onRegister={handleSuccess} />
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
