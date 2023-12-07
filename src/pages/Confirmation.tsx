import { FC, useEffect } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Loader } from "../components/Loader";
import { useUser } from "../contexts/UserContext";
import { HeroLayout } from "../layouts/heroLayout";
import { fetchConfirm } from "../__api__/auth";
import { ErrorRequest } from "../__api__/helpers";
import { ErrorPage } from "./Error";
import { useTranslation } from "react-i18next";

export const Confirmation: FC = () => {
  const { token } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { t } = useTranslation();

  const { status, error } = useQuery<void, ErrorRequest, void, any>(
    ["auth_confirmation", token],
    () => fetchConfirm(token || ""),
    {
      retry: false,
      enabled: Boolean(token && user),
      onError: async (error) => {
        if (error.status === 401) {
          setUser(null);
          navigate(`/login?returnPath=${pathname}`);
        }
      },
    }
  );

  useEffect(() => {
    if (!user && pathname) {
      navigate(`/login?returnPath=${pathname}`);
    }
  }, [navigate, pathname, user]);

  if (error) {
    return <ErrorPage title={t("ERROR_DEFAULT_TITLE")} />;
  }

  return (
    <HeroLayout>
      {status === "loading" ? (
        <div className="is-flex container is-align-items-center is-flex-direction-column is-justify-content-center">
          <Loader />
        </div>
      ) : (
        <div>
          <p className="title mb-6">{t("TITLE_CONFIRMED")}</p>
          <p className="subtitle">{t("SUBTITLE_CONFIRMED")}</p>
          <Link to="/dashboard">{t("LINK_PARTIES")}</Link>
        </div>
      )}
    </HeroLayout>
  );
};
