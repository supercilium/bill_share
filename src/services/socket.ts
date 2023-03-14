import { EventData } from "../types/events";
import { SOCKET_STATE } from "./constants";

export class SocketClient {
  socket: WebSocket | null;
  dataCallback: (event: MessageEvent<EventData>) => void;
  onChangeStateCallback: (state: number) => void;

  constructor(
    dataCallback: (event: MessageEvent<EventData>) => void,
    onChangeStateCallback: (state: number) => void
  ) {
    this.socket = null;
    this.dataCallback = dataCallback;
    this.onChangeStateCallback = onChangeStateCallback;
  }

  init(url: string) {
    this.socket = new WebSocket(url);
    this.socket.onclose = () => this.onClose.call(this);
    this.socket.onerror = (e: Event) => this.onError.call(this, e);
    this.socket.onmessage = (e: MessageEvent<string>) =>
      this.onMessage.call(this, e);
    this.socket.onopen = () => this.onOpen.call(this);
    return this;
  }

  private transformer(message: MessageEvent<string>) {
    const data = JSON.parse(message.data);
    return data;
  }

  private onClose() {
    this.onChangeStateCallback(SOCKET_STATE.closed);
    if (this.socket) {
      this.socket = null;
    }
  }

  private onError(e: Event) {
    this.onChangeStateCallback(SOCKET_STATE.closed);
    if (this.socket) {
      this.socket = null;
    }
  }

  private onMessage(message: MessageEvent<string>) {
    const data = this.transformer(message);
    if (data) {
      this.dataCallback(data);
    }
  }

  private onOpen() {
    if (!this.socket) {
      return;
    }

    this.onChangeStateCallback(this.socket?.readyState);
  }

  send(data: EventData) {
    if (!this.socket) {
      return;
    }
    this.socket.send(JSON.stringify(data));
  }

  close() {
    if (!this.socket) {
      return;
    }
    this.socket.close();
  }
}
