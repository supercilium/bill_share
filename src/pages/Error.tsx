import { FC } from "react";
import { useTranslation } from "react-i18next";
import { HeroLayout } from "../layouts/heroLayout";
import { useRouteError } from "react-router";

interface RouterError {
  statusText?: string;
  message?: string;
}

export const ErrorPage: FC<{ title?: string; text?: string }> = ({
  title,
  text,
}) => {
  const { t } = useTranslation();
  const error = useRouteError();

  return (
    <HeroLayout>
      <div>
        <p className="title mb-6">{t(title || "ERROR_DEFAULT_TITLE")}</p>
        <p className="subtitle is-flex is-align-items-baseline">
          {t(
            text ||
              (error as RouterError).statusText ||
              (error as RouterError).message ||
              "ERROR_DEFAULT_TEXT"
          )}{" "}
          <a className="button ml-2" href="/">
            {t("LINK_HOME")}
          </a>
        </p>
      </div>
    </HeroLayout>
  );
};
