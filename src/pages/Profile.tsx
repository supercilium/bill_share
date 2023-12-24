import { Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { DefinitionList } from "../components/DefinitionList";
import { useQuery } from "react-query";
import { fetchLogout } from "../__api__/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { sendCode } from "../__api__/users";
import { useNotifications } from "../contexts/NotificationContext";
import { ChangeAvatarForm } from "../containers/ChangeAvatarForm";
import { useTranslation } from "react-i18next";

export const Profile = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { addAlert } = useNotifications();
  const { refetch } = useQuery("logout", fetchLogout, {
    retry: false,
    enabled: false,
    onSettled: () => {
      setUser(null);
      navigate("/");
    },
  });
  const { refetch: sendConfirmationCode } = useQuery("confirmation", sendCode, {
    retry: false,
    enabled: false,
    onSuccess: () => {
      addAlert({
        mode: "success",
        text: t("ALERT_INFO_CONFIRMATION"),
      });
    },
    onError: () => {
      addAlert({
        mode: "danger",
        text: t("ALERT_ERROR_DEFAULT"),
      });
    },
  });
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);

  const items: React.ComponentProps<typeof DefinitionList>["items"] = [
    {
      label: t("LABEL_PROFILE_EMAIL"),
      value: user?.email,
    },
    {
      label: t("LABEL_PROFILE_NAME"),
      value: user?.name,
    },
    {
      label: t("LABEL_PROFILE_NOT_CONFIRMED"),
      value: user?.isConfirmed ? null : (
        <>
          {t("TITLE_CONFIRM_EMAIL")}
          <button
            onClick={() => sendConfirmationCode()}
            className="button is-ghost ml-3"
          >
            <FontAwesomeIcon className="mr-2 icon" size="xs" icon="envelope" />
            <span>{t("BUTTON_SEND_CODE")}</span>
          </button>
        </>
      ),
    },
    {
      label: "",
      value: (
        <Link to="/change-password" className="button is-link">
          {t("BUTTON_CHANGE_PASSWORD")}
        </Link>
      ),
    },
    {
      label: "",
      value: (
        <button className="button" onClick={() => refetch()}>
          <FontAwesomeIcon className="mr-3" icon="arrow-right-from-bracket" />
          <span>{t("BUTTON_LOG_OUT")}</span>
        </button>
      ),
    },
  ];

  return (
    <PlainLayout
      Main={
        <Main>
          {user && (
            <div className="box mt-6">
              <h1 className="title is-3">{t("TITLE_ACCOUNT")}</h1>
              <div className="columns">
                <div className="column is-narrow">
                  <ChangeAvatarForm />
                </div>
                <div className="column">
                  <DefinitionList items={items} />
                </div>
              </div>
            </div>
          )}
        </Main>
      }
    />
  );
};

Profile.whyDidYouRender = true;

export default Profile;
