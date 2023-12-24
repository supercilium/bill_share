import { FC, ReactNode } from "react";
import { Footer } from "../components";
import { useTranslation } from "react-i18next";

interface PlainLayoutInterface {
  children: ReactNode;
}

export const HeroLayout: FC<PlainLayoutInterface> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <section className="hero is-fullheight">
      <div className="hero-body">{children}</div>
      <div className="hero-foot" id="hero-footer" />
    </section>
  );
};
