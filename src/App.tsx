import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.scss";
import { Party } from "./pages/Party";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
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
import { Profile } from "./pages/Profile";
import { ServiceAgreement } from "./pages/Agreement";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/party/:partyId",
    element: <Party />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/service-agreement",
    element: <ServiceAgreement />,
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
