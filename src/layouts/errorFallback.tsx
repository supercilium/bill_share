import { useTranslation } from "react-i18next";

export const ErrorFallback = () => {
  const { t } = useTranslation();

  return (
    <section className="hero is-fullheight">
      <div className="hero-body">
        <div>
          <p className="title mb-6">{t("ERROR_DEFAULT_TITLE")}</p>
          <p className="subtitle is-flex is-align-items-baseline">
            {t("ERROR_DEFAULT_TEXT")}
            <a className="button ml-2" href="/">
              {t("LINK_HOME")}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
