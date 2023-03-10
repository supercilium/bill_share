import { EventData, EventResponseDTO } from "../types/events";
import { DedicatedWorkerClass } from "./dedicated-worker";

export let transport: DedicatedWorkerClass;

export const connect = (id: string) => {
  transport.sendMessage({ type: "connect", id });
};

export const createTransport = (
  onMessageCtxNFunc: (event: EventResponseDTO) => void,
  onErrorCtxNFunc: (state: number) => void,
  onChangeSocketState: (state: number) => void,
  id: string
) => {
  transport = new DedicatedWorkerClass(
    onMessageCtxNFunc,
    onErrorCtxNFunc,
    onChangeSocketState
  );
  connect(id);
};

export const sendEvent = (data: EventData) => {
  transport.sendMessage(data);
};
