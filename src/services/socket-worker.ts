/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
import { EventData, WorkerData } from "../types/events";
import { SocketClient } from "./socket";

self.onmessage = (e: MessageEvent<EventData>) => {
  console.log("Message from main thread", e);
  const data = e.data;
  if (validateEventData(data)) {
    actionSwitcher(data);
  } else {
    console.log(
      "Invalid message data passed from main thread so taking no action"
    );
  }
};

const validateEventData = (data: any) => {
  //Validate all the request from main thread if you want to follow strict communication protocols
  //between main thread and the worker thread
  return true;
};

let webSocket: SocketClient | null = null;

const eventHandler = (event: MessageEvent<EventData>) => {
  self.postMessage(event);
};

const stateChangeHandler = (state: number) => {
  self.postMessage({
    type: "change state",
    message: state,
  });
};

export const closeWebSocket = () => {
  webSocket && webSocket.close();
};

const actionSwitcher = (data: EventData) => {
  try {
    if (data.type === "connect") {
      webSocket = new SocketClient(eventHandler, stateChangeHandler);
      webSocket.init(
        `${process.env.REACT_APP_API_SOCKET_URL || "ws://localhost:8087"}/ws/${
          (data as WorkerData).id
        }`
      );
      if (webSocket.socket?.readyState !== 1) {
        return;
      }
      self.postMessage({
        type: data.type,
        message: "Connected",
      });
      return;
    }
    if (data.type === "close") {
      closeWebSocket();
      self.postMessage({
        type: data.type,
        message: "Disconnected",
      });
      return;
    }
    if (!webSocket) {
      self.postMessage({
        type: "error",
        message: "Error",
      });
      return;
    }
    if (webSocket.socket?.readyState !== 1) {
      stateChangeHandler(webSocket.socket?.readyState as number);
      return;
    }

    webSocket.send(data);
  } catch (e) {
    self.postMessage({
      type: "error",
      message: "Error",
    });
  }
};
