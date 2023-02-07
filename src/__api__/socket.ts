import { USER_KEY } from "../contexts/UserContext";

export const socketClient = {
    connected: false,
    error: '',
    socket: {} as WebSocket,
    connect: (id: string, cb: (event: MessageEvent<string>) => void) => {
        const { token } = JSON.parse(localStorage.getItem(USER_KEY) || "{}") || {};
        if (socketClient.connected) {
            return;
        }
        socketClient.socket = new WebSocket(`${process.env.REACT_APP_API_SOCKET_URL || 'ws://localhost:8087'}/ws/${id}`, ['access_token', `Bearer ${token}`]);
        // socketClient.socket = new WebSocket(`${process.env.REACT_APP_API_SOCKET_URL || 'localhost:3001'}/ws/${id}`);

        socketClient.socket.onopen = () => {
            socketClient.connected = true;
            socketClient.error = '';
            console.log("is connected");
        }
        socketClient.socket.onerror = () => {
            socketClient.connected = false;
            socketClient.error = 'Error during socket connection';
            console.log("error");
        }
        socketClient.socket.onclose = () => {
            socketClient.connected = false;
            console.log("is disconnected");
            // setTimeout(function () {
            //     socketClient.connect(socketClient.id, cb);
            // }, 1000);
        }
        socketClient.socket.onmessage = (message: MessageEvent<string>) => {
            cb(message);
        }
    },
    reConnect: (id: string, cb: (event: MessageEvent<string>) => void) => {
        if (socketClient.socket && socketClient.socket.readyState !== 3) {
            socketClient.socket.close();
            socketClient.connected = false;
        }

        socketClient.connect(id, cb);
    }
}