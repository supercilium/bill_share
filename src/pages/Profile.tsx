import { Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { useUser } from "../contexts/UserContext";
import { Navbar } from "../containers/Navbar";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { DefinitionList } from "../components/DefinitionList";
import { useQuery } from "react-query";
import { fetchLogout } from "../__api__/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { fetchUser, sendCode } from "../__api__/users";
import { useNotifications } from "../contexts/NotificationContext";

const LABELS = {
  email: "Email address",
  name: "Username",
  isConfirmed: "Your email is not confirmed",
  changePassword: "Change password",
  logout: "Log out",
};

export const Profile = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { addAlert } = useNotifications();
  const { refetch } = useQuery(["logout"], fetchLogout, {
    retry: false,
    enabled: false,
    onSettled: () => {
      setUser(null);
      navigate("/");
    },
  });
  useQuery(["user"], fetchUser, {
    onSuccess: (data) => {
      setUser(data);
    },
  });
  const { refetch: sendConfirmationCode } = useQuery(
    ["confirmation"],
    sendCode,
    {
      retry: false,
      enabled: false,
      onSuccess: () => {
        addAlert({
          mode: "success",
          text: "Confirmation code was sent",
        });
      },
      onError: () => {
        addAlert({
          mode: "danger",
          text: "Something went wrong, please try later",
        });
      },
    }
  );

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);

  const items: React.ComponentProps<typeof DefinitionList>["items"] = [
    {
      label: LABELS.email,
      value: user?.email,
    },
    {
      label: LABELS.name,
      value: user?.name,
    },
    {
      label: LABELS.isConfirmed,
      value: (
        <>
          To secure your account please confirm your email address
          <button
            onClick={() => sendConfirmationCode()}
            className="button is-ghost ml-3"
          >
            <FontAwesomeIcon className="mr-2 icon" size="xs" icon="envelope" />
            <span>Send code</span>
          </button>
        </>
      ),
    },
    {
      label: "",
      value: (
        <Link to="/change-password" className="button is-link">
          {LABELS.changePassword}
        </Link>
      ),
    },
    {
      label: "",
      value: (
        <button className="button" onClick={() => refetch()}>
          <FontAwesomeIcon className="mr-3" icon="arrow-right-from-bracket" />
          <span>{LABELS.logout}</span>
        </button>
      ),
    },
  ];

  return (
    <PlainLayout
      Navbar={<Navbar shouldShowAuthButtons={false} />}
      Main={
        <Main>
          {user && (
            <div className="box mt-6">
              <h1 className="title is-3">Account</h1>{" "}
              <DefinitionList items={items} />
            </div>
          )}
        </Main>
      }
    />
  );
};

Profile.whyDidYouRender = true;

export default Profile;
