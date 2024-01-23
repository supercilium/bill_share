import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import "./App.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import {
  faCrown,
  faWineGlassEmpty,
  faBeerMugEmpty,
  faSpinner,
  faChampagneGlasses,
  faXmark,
  faPeopleGroup,
  faSliders,
  faArrowRightFromBracket,
  faCheck,
  faClone,
  faEnvelope,
  faPencil,
  faUpload,
  faShareNodes,
  faEllipsisVertical,
  faCircleUser,
  faEarthEurope,
} from "@fortawesome/free-solid-svg-icons";
import { UISettingsProvider } from "./contexts/UIsettings";
import { UserProvider } from "./contexts/UserContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ErrorPage } from "./pages/Error";
import { Loader } from "./components/Loader";
import { ServiceAgreement } from "./pages/Agreement";
import { Confirmation } from "./pages/Confirmation";
import { ResetPassword } from "./pages/ResetPassword";
import { ChangePassword } from "./pages/ChangePassword";
import { setXSRF } from "./utils/cookie";
import i18n from "./services/i18next";
import { PromptProvider } from "./contexts/PromptContext";
import { ErrorBoundary } from "./containers/ErrorBoundary";
import { Root } from "./pages/root";
import { ErrorFallback } from "./layouts/errorFallback";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Home = React.lazy(() => import("./pages/Home"));
const Party = React.lazy(() => import("./pages/Party"));
const Login = React.lazy(() => import("./pages/Login"));

library.add(
  faCrown,
  faWineGlassEmpty,
  faBeerMugEmpty,
  faSpinner,
  faChampagneGlasses,
  faXmark,
  faPeopleGroup,
  faSliders,
  faArrowRightFromBracket,
  faCheck,
  faClone,
  faEnvelope,
  faPencil,
  faUpload,
  faShareNodes,
  faEllipsisVertical,
  faCircleUser,
  faEarthEurope
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "party/:partyId",
        element: <Party />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "change-password",
        element: <ChangePassword />,
      },
      {
        path: "confirm/:token",
        element: <Confirmation />,
      },
      {
        path: "service-agreement",
        element: <ServiceAgreement />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: () => {
        setXSRF();
      },
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense
        fallback={
          <div className="is-flex full-height container is-align-items-center is-flex-direction-column is-justify-content-center">
            <Loader />
          </div>
        }
      >
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <NotificationProvider>
              <PromptProvider>
                <UserProvider>
                  <UISettingsProvider>
                    <RouterProvider
                      router={router}
                      fallbackElement={<ErrorPage />}
                    />
                  </UISettingsProvider>
                </UserProvider>
              </PromptProvider>
            </NotificationProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </I18nextProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

App.whyDidYouRender = true;

export default App;
