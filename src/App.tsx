import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Party } from "./pages/Party";
import { Home } from "./pages/Home";
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
