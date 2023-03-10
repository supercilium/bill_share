import { EventData } from "../types/events";

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
    this.socket.onclose = this.onClose;
    this.socket.onerror = this.onError;
    this.socket.onmessage = (e) => this.onMessage(e);
    this.socket.onopen = () => this.onOpen();
    return this;
  }

  private transformer(message: MessageEvent<string>) {
    const data = JSON.parse(message.data);
    return data;
  }

  private onClose() {
    if (!this.socket) {
      return;
    }
    this.onChangeStateCallback(this.socket?.readyState);
  }

  private onError() {
    if (!this.socket) {
      return;
    }
    this.onChangeStateCallback(this.socket?.readyState);
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
