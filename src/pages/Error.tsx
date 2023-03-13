import { FC } from "react";
import { HeroLayout } from "../layouts/heroLayout";

export const ErrorPage: FC<{ title?: string; text?: string }> = ({
  title,
  text,
}) => {
  return (
    <HeroLayout>
      <div>
        <p className="title mb-6">{title || "Ooops! Something went wrong"}</p>
        <p className="subtitle is-flex is-align-items-baseline">
          {text || "Try to refresh the page or go to"}{" "}
          <a className="button ml-2" href="/">
            home page
          </a>
        </p>
      </div>
    </HeroLayout>
  );
};
