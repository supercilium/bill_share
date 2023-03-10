/* eslint-disable no-console */

import { EventResponseDTO } from "../types/events";

//Main thread
export class DedicatedWorkerClass {
  worker: Worker | null;
  userCallbacks: {
    onMessageCtxNFunc: (event: EventResponseDTO) => void;
    onErrorCtxNFunc: (state: number) => void;
    onChangeSocketState: (state: number) => void;
  };

  constructor(
    onMessageCtxNFunc: (event: EventResponseDTO) => void,
    onErrorCtxNFunc: (state: number) => void,
    onChangeSocketState: (state: number) => void
  ) {
    if (!!window.Worker) {
      this.worker = new Worker(new URL("./socket-worker.ts", import.meta.url));
      this.worker.onerror = (e) => this.onError(e);
      this.worker.onmessage = (e) => this.onMessage(e);
      this.userCallbacks = {
        onMessageCtxNFunc,
        onErrorCtxNFunc,
        onChangeSocketState,
      };
    } else {
      throw new Error(
        "WebWorker not supported by browser. Please use an updated browser."
      );
    }
  }

  sendMessage(data = {}, transferData = []) {
    if (!this.worker) {
      return;
    }
    this.worker.postMessage(data, transferData);
  }

  terminate() {
    if (!this.worker) {
      return;
    }
    this.userCallbacks.onChangeSocketState(3);
    // this.worker.closeWebSocket();
    this.worker.terminate();
    this.worker = null;
  }

  onError(e: any) {
    console.log(
      "There is an error with the dedicated worker thread of Order Table",
      e
    );
    this.userCallbacks.onChangeSocketState(3);
    // this.userCallbacks.onErrorCtxNFunc &&
    //   this.userCallbacks.onErrorCtxNFunc.apply(
    //     this.userCallbacks.onErrorCtxNFunc.ctx,
    //     [e]
    //   );
  }

  onMessage(e: MessageEvent<EventResponseDTO>) {
    console.log("Message from worker thread", e);
    this.userCallbacks.onMessageCtxNFunc(e.data);
    // this.userCallbacks.onMessageCtxNFunc &&
    //   this.userCallbacks.onMessageCtxNFunc.apply(
    //     this.userCallbacks.onMessageCtxNFunc.ctx,
    //     [e.data]
    //   );
  }
}
