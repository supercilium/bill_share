import React, { ReactNode, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
} from "@fortawesome/free-solid-svg-icons";
import { UISettingsProvider } from "./contexts/UIsettings";
import { UserProvider } from "./contexts/UserContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { NotificationList } from "./containers/NotificationList";
import { ErrorPage } from "./pages/Error";
import { HeroLayout } from "./layouts/heroLayout";
import { Loader } from "./components/Loader";
import { ServiceAgreement } from "./pages/Agreement";
import { Confirmation } from "./pages/Confirmation";
import { ResetPassword } from "./pages/ResetPassword";
import { setXSRF } from "./utils/cookie";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
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
  faClone
);

const withSuspense = (component: ReactNode) => (
  <Suspense
    fallback={
      <HeroLayout>
        <div className="is-flex container is-align-items-center is-flex-direction-column is-justify-content-center">
          <Loader />
        </div>
      </HeroLayout>
    }
  >
    {component}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<Home />),
  },
  {
    path: "/party/:partyId",
    element: withSuspense(<Party />),
  },
  {
    path: "/login",
    element: withSuspense(<Login />),
  },
  {
    path: "/dashboard",
    element: withSuspense(<Dashboard />),
  },
  {
    path: "/confirm/:token",
    element: <Confirmation />,
  },
  {
    path: "/service-agreement",
    element: <ServiceAgreement />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "*",
    element: <ErrorPage title="404: Ooops, we didn't prepare such page" />,
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
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <UserProvider>
          <UISettingsProvider>
            <RouterProvider router={router} />
            <NotificationList />
          </UISettingsProvider>
        </UserProvider>
      </NotificationProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

App.whyDidYouRender = true;

export default App;
