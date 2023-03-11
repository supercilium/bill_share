import { EventData, EventResponseDTO } from "../types/events";
import { DedicatedWorker } from "./dedicatedWorker";

export class Transport {
  static transport: DedicatedWorker | null;

  static createTransport = (
    onMessageCtxNFunc: (event: EventResponseDTO) => void,
    onChangeSocketState: (state: number) => void,
    id: string
  ) => {
    this.transport = new DedicatedWorker(
      onMessageCtxNFunc,
      onChangeSocketState
    );
    this.connect(id);
  };

  static connect = (id: string) => {
    this.transport?.sendMessage({ type: "connect", id });
  };

  static sendEvent = (data: EventData) => {
    this.transport?.sendMessage(data);
  };

  static terminate = () => {
    this.transport?.terminate();
    this.transport = null;
  };
}
