export const socketClient = {
    connected: false,
    error: '',
    socket: {} as WebSocket,
    connect: (id: string, cb: (event: MessageEvent<string>) => void) => {
        if (socketClient.connected) {
            return;
        }
        socketClient.socket = new WebSocket(`${process.env.REACT_APP_API_SOCKET_URL || 'localhost:3001/socket'}/${id}`);

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
            console.log("message");
            cb(message);
        }
    }
}