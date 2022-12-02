import io from 'socket.io-client';

export const socket = io(process.env.REACT_APP_API_SOCKET_URL || 'localhost:3001');