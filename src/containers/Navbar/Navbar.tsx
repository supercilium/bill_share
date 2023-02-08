import { FC } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../contexts/UserContext";
import { Navbar as NavbarUI } from "../../components/Navbar";
import { fetchLogout } from "../../__api__/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface NavbarProps {}

export const Navbar: FC<NavbarProps> = (props) => {
  const { setUser, user } = useUser();
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
  console.log(user);

  return (
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
            <FontAwesomeIcon className="mr-3" icon="arrow-right-from-bracket" />
            Log out
          </button>
        ) : (
          <>
            <button className="button is-primary">
              <strong>Sign up</strong>
            </button>
            <button className="button is-light">Log in</button>
          </>
        )
      }
    />
  );
};
