import { FC, useEffect } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Loader } from "../components/Loader";
import { useUser } from "../contexts/UserContext";
import { HeroLayout } from "../layouts/heroLayout";
import { fetchConfirm } from "../__api__/auth";
import { ErrorRequest } from "../__api__/helpers";
import { ErrorPage } from "./Error";

export const Confirmation: FC = () => {
  const { token } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();

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
    return <ErrorPage title="Ooops, we don't know what's happened..." />;
  }

  return (
    <HeroLayout>
      {status === "loading" ? (
        <div className="is-flex container is-align-items-center is-flex-direction-column is-justify-content-center">
          <Loader />
        </div>
      ) : (
        <div>
          <p className="title mb-6">Thank You!</p>
          <p className="subtitle">Your email address has been confirmed</p>
          <Link to="/dashboard">Check your parties</Link>
        </div>
      )}
    </HeroLayout>
  );
};
