/* eslint-disable jsx-a11y/anchor-is-valid */
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
import { User } from "../../types/user";
import { Transport } from "../../services/transport";
import { Modal } from "../../components/Modal";
import { SUPPORTED_LANGUAGES } from "../../services/constants";

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
  const { t, i18n } = useTranslation();
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

  const handleSuccess = () => {
    setOpenedPopup(null);
    navigate("/dashboard");
  };

  const hasUserLinks = user?.role === "AUTHENTICATED";

  const renderUserMenu = useCallback(
    (user: User) => (
      <div className="navbar-item has-dropdown is-hoverable">
        <a className="navbar-link">
          <FontAwesomeIcon className="mr-3" icon="circle-user" />
          {user.name}
        </a>

        <div
          className={cx("navbar-dropdown", {
            "is-boxed has-background-dark": navbarProps?.isTransparent,
          })}
        >
          {hasUserLinks && (
            <>
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
            </>
          )}
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
    [navbarProps?.isTransparent, t, hasUserLinks]
  );
  const displayNames = new Intl.DisplayNames([i18n.language], {
    type: "language",
  });

  return (
    <>
      <NavbarUI
        NavbarEndItems={
          <>
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link is-capitalized">
                <FontAwesomeIcon className="mr-3" icon="earth-europe" />

                {displayNames.of(i18n.language)}
              </a>

              <div
                className={cx("navbar-dropdown", {
                  "is-boxed has-background-dark": navbarProps?.isTransparent,
                })}
              >
                {SUPPORTED_LANGUAGES.map((lang) => {
                  return (
                    <a
                      onClick={() => i18n.changeLanguage(lang)}
                      key={lang}
                      className={cx("navbar-item is-capitalized", {
                        "is-active": i18n.resolvedLanguage === lang,
                      })}
                    >
                      {`${displayNames.of(lang)}`}
                    </a>
                  );
                })}
              </div>
            </div>
            {user ? (
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
            )}
          </>
        }
        navbarProps={navbarProps}
      />
      <Modal isOpen={!!openedPopup} onClose={() => setOpenedPopup(null)}>
        <div className="tabs is-large">
          <ul>
            <li className={cx({ "is-active": openedPopup === "login" })}>
              <a role="button" onClick={() => setOpenedPopup("login")}>
                {t("BUTTON_LOG_IN")}
              </a>
            </li>
            <li
              className={cx({
                "is-active": openedPopup === "registration",
              })}
            >
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
      </Modal>
    </>
  );
};
