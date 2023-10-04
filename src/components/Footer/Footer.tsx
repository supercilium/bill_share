import { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Columns } from "../Columns";
import "./Footer.scss";

export const Footer: FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <footer className="footer is-relative">
      {children}
      <hr />
      <Columns>
        <div />
        <div>
          <p className="is-size-5 mb-2">{t("TITLE_FOOTER_CREDS")}</p>
          <p className="is-size-6 mb-1">
            <a target="_blank" rel="noreferrer" href="https://github.com/Oyns">
              {t("LINK_FOOTER_OYNS")}
            </a>
          </p>
          <p className="is-size-6 mb-1">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/supercilium"
            >
              {t("LINK_FOOTER_SUPERCILIUM")}
            </a>
          </p>
          <p className="is-size-6 mb-1">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/Ifkeybirf"
            >
              {t("LINK_FOOTER_IFKEYBIRF")}
            </a>
          </p>
        </div>
      </Columns>
      <div className="version-tag px-5 has-text-grey">
        <Link className="is-size-6 has-text-grey" to="/service-agreement">
          {t("TITLE_FOOTER_SERVICE")}
        </Link>
        <span className="is-pulled-right is-size-7">
          {t("VERSION", { version: process.env.REACT_APP_VERSION })}
        </span>
      </div>
    </footer>
  );
};
