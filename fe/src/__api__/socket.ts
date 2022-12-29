export const socketClient = {
    connected: false,
    socket: {} as WebSocket,
    connect: (id: string) => {
        if (socketClient.connected) {
            return;
        }
        socketClient.socket = new WebSocket(`${process.env.REACT_APP_API_SOCKET_URL || 'localhost:3001/socket'}/${id}`);

        socketClient.socket.onopen = () => {
            socketClient.connected = true;
        }
        socketClient.socket.onclose = () => {
            socketClient.connected = false;
        }
    }
}