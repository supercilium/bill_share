import { FC, ReactNode } from "react";
import { Footer as FooterComponent } from "../components";
import { Navbar } from "../containers/Navbar";
import { useScrollTop } from "../hooks/useScrollTop";
import { useTranslation } from "react-i18next";

interface PlainLayoutInterface {
  Header?: ReactNode;
  Aside?: ReactNode;
  Footer?: ReactNode;
  Navbar?: ReactNode;
  Main: ReactNode;
}

export const PlainLayout: FC<PlainLayoutInterface> = ({
  Header,
  Aside,
  Footer,
  Main,
  Navbar: NavbarComponent,
}) => {
  useScrollTop();
  const { t } = useTranslation();

  return (
    <div
      style={{ minHeight: "100vh" }}
      className="is-flex is-flex-direction-column is-justify-content-space-between"
    >
      {NavbarComponent || (
        <Navbar navbarProps={{ isFixed: true, hasShadow: true }} />
      )}
      {Header}
      <main className="is-flex-grow-5">{Main}</main>
      {Aside}
      {Footer || <FooterComponent>{t("TITLE_FOOTER")}</FooterComponent>}
    </div>
  );
};
