import { Outlet, matchPath, useLocation } from "react-router";
import { NotificationList } from "../containers/NotificationList";
import { PromptList } from "../containers/PromptList";
import { Suspense } from "react";
import { HeroLayout } from "../layouts/heroLayout";
import { Loader } from "../components/Loader";
import { Navbar } from "../containers/Navbar";
import { Footer as FooterComponent } from "../components";
import { useTranslation } from "react-i18next";
import { ScrollRestoration } from "react-router-dom";
import { createPortal } from "react-dom";

const ROUTES_WITHOUT_AUTH_BUTTONS = ["profile", "dashboard"];
const ROUTES_WITH_HERO_LAYOUT = [
  "service-agreement",
  "reset-password",
  "confirm/:token",
];
const ROUTES_WITH_TRANSPARENT_NAVBAR = ["/"];

const checkRoutes = (
  routes: string[],
  location: ReturnType<typeof useLocation>
) => routes.some((pattern) => matchPath(pattern, location.pathname));

export const Root = () => {
  const location = useLocation();
  const hasAuthButtons = !checkRoutes(ROUTES_WITHOUT_AUTH_BUTTONS, location);
  const hasFixedNavbar = !checkRoutes(ROUTES_WITH_HERO_LAYOUT, location);
  const hasCustomNavbar = checkRoutes(ROUTES_WITH_TRANSPARENT_NAVBAR, location);
  const { t } = useTranslation();
  const heroFooterComponent = document.getElementById("hero-footer");

  return (
    <Suspense
      fallback={
        <HeroLayout>
          <div className="is-flex container is-align-items-center is-flex-direction-column is-justify-content-center">
            <Loader />
          </div>
        </HeroLayout>
      }
    >
      {!hasCustomNavbar && (
        <Navbar
          shouldShowAuthButtons={hasAuthButtons}
          navbarProps={{
            isFixed: hasFixedNavbar,
            hasShadow: true,
          }}
        />
      )}
      <Outlet />
      {heroFooterComponent ? (
        createPortal(
          <FooterComponent>{t("TITLE_FOOTER")}</FooterComponent>,
          heroFooterComponent
        )
      ) : (
        <FooterComponent>{t("TITLE_FOOTER")}</FooterComponent>
      )}
      <ScrollRestoration />
      <NotificationList />
      <PromptList />
    </Suspense>
  );
};
