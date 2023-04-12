import { FC } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { Loader } from "../components/Loader";
import { HeroLayout } from "../layouts/heroLayout";
import { fetchConfirm } from "../__api__/auth";
import { ErrorPage } from "./Error";

export const Confirmation: FC = () => {
  const { token } = useParams();

  const { status, error } = useQuery(
    ["auth_confirmation", token],
    () => fetchConfirm(token || ""),
    {
      retry: false,
      enabled: !!token,
    }
  );

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
          <p className="title mb-6 has-text-centered">Thank You!</p>
          <p className="subtitle">Your email address have been confirmed</p>
          <Link to="/dashboard">Check your parties</Link>
        </div>
      )}
    </HeroLayout>
  );
};
