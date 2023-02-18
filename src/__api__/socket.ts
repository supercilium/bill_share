export const socketClient = {
    connected: false,
    error: '',
    socket: {} as WebSocket,
    connect: (id: string, onSuccess: (event: MessageEvent<string>) => void, setStateCb?: (state: number) => void) => {
        if (socketClient.connected) {
            return;
        }
        socketClient.socket = new WebSocket(`${process.env.REACT_APP_API_SOCKET_URL || 'ws://localhost:8087'}/ws/${id}`);

        socketClient.socket.onopen = () => {
            socketClient.connected = true;
            setStateCb?.(socketClient.socket.readyState);
            socketClient.error = '';
        }
        socketClient.socket.onerror = () => {
            socketClient.connected = false;
            setStateCb?.(socketClient.socket.readyState);
            socketClient.error = 'Error during socket connection';
        }
        socketClient.socket.onclose = () => {
            socketClient.connected = false;
            setStateCb?.(socketClient.socket.readyState);
            // setTimeout(function () {
            //     socketClient.connect(socketClient.id, cb);
            // }, 1000);
        }
        socketClient.socket.onmessage = (message: MessageEvent<string>) => {
            onSuccess(message);
        }
    },
    reConnect: (id: string, onSuccess: (event: MessageEvent<string>) => void, setStateCb?: (state: number) => void) => {
        socketClient.disconnect();

        socketClient.connect(id, onSuccess, setStateCb);
    },
    disconnect: () => {
        if (socketClient.socket && socketClient.socket.readyState !== 3) {
            socketClient.socket?.close?.();
            socketClient.connected = false;
            socketClient.error = '';
        }
    }
}