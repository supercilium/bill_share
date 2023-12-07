import { FC, ReactNode } from "react";
import { Footer } from "../components";
import { Navbar } from "../containers/Navbar";
import { useScrollTop } from "../hooks/useScrollTop";
import { useTranslation } from "react-i18next";

interface PlainLayoutInterface {
  children: ReactNode;
}

export const HeroLayout: FC<PlainLayoutInterface> = ({ children }) => {
  useScrollTop();
  const { t } = useTranslation();

  return (
    <div>
      <Navbar navbarProps={{ hasShadow: true }} />
      <section className="hero is-fullheight">
        <div className="hero-body">{children}</div>
        <div className="hero-foot">
          <Footer>{t("TITLE_FOOTER")}</Footer>
        </div>
      </section>
    </div>
  );
};
