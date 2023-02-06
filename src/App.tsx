import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import "./bulma-rtl.min.css";
import { Party } from "./pages/Party";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCrown,
  faWineGlassEmpty,
  faBeerMugEmpty,
  faSpinner,
  faChampagneGlasses,
  faLink,
  faXmark,
  faPeopleGroup,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { UISettingsProvider } from "./contexts/UIsettings";
import { Register } from "./pages/Register";

library.add(
  faCrown,
  faWineGlassEmpty,
  faBeerMugEmpty,
  faSpinner,
  faChampagneGlasses,
  faLink,
  faXmark,
  faPeopleGroup,
  faSliders
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
    path: "/register",
    element: <Register />,
  },
]);

const App = () => {
  return (
    <UISettingsProvider>
      <RouterProvider router={router} />
    </UISettingsProvider>
  );
};

App.whyDidYouRender = true;

export default App;
