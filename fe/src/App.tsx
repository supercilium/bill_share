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
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("is connected");
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    socket.on("add user", (data) => {
      setLastMessage(data);
      console.log(data);
    });
    socket.on("remove user", (data) => {
      setLastMessage(data);
      console.log(data);
    });
    socket.on("add item", (data) => {
      setLastMessage(data);
      console.log(data);
    });
    socket.on("update item", (data) => {
      setLastMessage(data);
      console.log(data);
    });
    socket.on("remove item", (data) => {
      setLastMessage(data);
      console.log(data);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

export default App;
