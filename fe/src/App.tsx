import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Party } from "./pages/Party";
import { Home } from "./pages/Home";
import { StrictMode, useEffect, useState } from "react";
import { socket } from "./__api__/socket";

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

function App() {
  const [isConnected, setIsConnected] = useState(socket.readyState === 1);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    socket.addEventListener("connect", () => {
      setIsConnected(true);
      console.log("is connected");
    });
    socket.addEventListener("disconnect", () => {
      setIsConnected(false);
    });
    // socket.on("add item", (data) => {
    //   setLastMessage(data);
    //   console.log(data);
    // });
    // socket.on("update item", (data) => {
    //   setLastMessage(data);
    //   console.log(data);
    // });
    // socket.on("remove item", (data) => {
    //   setLastMessage(data);
    //   console.log(data);
    // });
    return () => {
      socket.removeEventListener("connect", () => {});
      socket.removeEventListener("disconnect", () => {});
      socket.removeEventListener("message", () => {});
    };
  }, []);

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

export default App;
