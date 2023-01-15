import { EventData } from "../types/events";
import { socketClient } from "../__api__/socket";

export const sendEvent = (data: EventData) => {
    socketClient.socket.send(
        JSON.stringify({
            ...data
        })
    );
}