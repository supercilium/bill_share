import { FC } from "react";
import { useTranslation } from "react-i18next";
import { HeroLayout } from "../layouts/heroLayout";

export const ErrorPage: FC<{ title?: string; text?: string }> = ({
  title,
  text,
}) => {
  const { t } = useTranslation();

  return (
    <HeroLayout>
      <div>
        <p className="title mb-6">{t(title || "ERROR_DEFAULT_TITLE")}</p>
        <p className="subtitle is-flex is-align-items-baseline">
          {t(text || "ERROR_DEFAULT_TEXT")}{" "}
          <a className="button ml-2" href="/">
            {t("LINK_HOME")}
          </a>
        </p>
      </div>
    </HeroLayout>
  );
};
