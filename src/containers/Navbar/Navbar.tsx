import { FC, useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../contexts/UserContext";
import { Navbar as NavbarUI } from "../../components/Navbar";
import { fetchLogout } from "../../__api__/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginForm } from "../LoginForm";
import { RegisterForm } from "../RegisterForm";

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
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <NavbarUI
        MobileVisibleItems={
          user && (
            <span className="navbar-item is-hidden-desktop">
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
            </span>
          )
        }
        NavbarEndItems={
          user ? (
            <button onClick={() => handleLogout()} className="button is-light">
              <FontAwesomeIcon
                className="mr-3"
                icon="arrow-right-from-bracket"
              />
              Log out
            </button>
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
                  Log in
                </button>
              </>
            )
          )
        }
      />
      {openedPopup && (
        <div className={`modal${openedPopup ? " is-active" : ""}`}>
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="box">
              {openedPopup === "login" ? (
                <LoginForm onLogin={() => setOpenedPopup(null)} />
              ) : (
                <RegisterForm onRegister={() => setOpenedPopup(null)} />
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
