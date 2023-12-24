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

const ROUTES_WITHOUT_AUTH_BUTTONS = ["profile", "dashboard"];
const ROUTES_WITH_HERO_LAYOUT = [
  "service-agreement",
  "reset-password",
  "confirm/:token",
];
const ROUTES_WITH_TRANSPARENT_NAVBAR = ["/"];

export const Root = () => {
  const location = useLocation();
  const hasAuthButtons = !ROUTES_WITHOUT_AUTH_BUTTONS.some((pattern) =>
    matchPath(pattern, location.pathname)
  );
  const hasFixedNavbar = !ROUTES_WITH_HERO_LAYOUT.some((pattern) =>
    matchPath(pattern, location.pathname)
  );
  const hasCustomNavbar = ROUTES_WITH_TRANSPARENT_NAVBAR.some((pattern) =>
    matchPath(pattern, location.pathname)
  );
  const { t } = useTranslation();

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
      {hasFixedNavbar && <FooterComponent>{t("TITLE_FOOTER")}</FooterComponent>}
      <ScrollRestoration />
      <NotificationList />
      <PromptList />
    </Suspense>
  );
};
