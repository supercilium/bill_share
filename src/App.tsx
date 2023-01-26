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
  faShareFromSquare,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faCrown,
  faWineGlassEmpty,
  faBeerMugEmpty,
  faSpinner,
  faChampagneGlasses,
  faShareFromSquare
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
  return <RouterProvider router={router} />;
};

App.whyDidYouRender = true;

export default App;
