/* eslint-disable no-console */

import { EventData, EventResponseDTO } from "../types/events";
import { SOCKET_STATE } from "./constants";

//Main thread
export class DedicatedWorker {
  worker: Worker | null;
  userCallbacks: {
    onMessageCtxNFunc: (event: EventResponseDTO) => void;
    onChangeSocketState: (state: number) => void;
  };

  constructor(
    onMessageCtxNFunc: (event: EventResponseDTO) => void,
    onChangeSocketState: (state: number) => void
  ) {
    if (!!window.Worker) {
      this.worker = new Worker(new URL("./socketWorker.ts", import.meta.url));
      this.worker.onerror = (e) => this.onError(e);
      this.worker.onmessage = (e) => this.onMessage(e);
      this.userCallbacks = {
        onMessageCtxNFunc,
        onChangeSocketState,
      };
    } else {
      throw new Error(
        "WebWorker not supported by browser. Please use an updated browser."
      );
    }
  }

  sendMessage(data: EventData) {
    if (!this.worker) {
      return;
    }
    this.worker.postMessage(data);
  }

  terminate() {
    if (!this.worker) {
      return;
    }
    this.worker.postMessage({ type: "close" });
    // this.worker.closeWebSocket();
    this.worker.terminate();
    this.userCallbacks.onChangeSocketState(SOCKET_STATE.closed);
    this.worker = null;
  }

  onError(e: any) {
    console.error("There is an error with the dedicated worker thread", e);
    this.userCallbacks.onChangeSocketState(SOCKET_STATE.closed);
  }

  onMessage(e: MessageEvent<EventResponseDTO>) {
    this.userCallbacks.onMessageCtxNFunc(e.data);
  }
}
