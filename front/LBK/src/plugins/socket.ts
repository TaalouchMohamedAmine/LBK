import { io } from 'socket.io-client';

// Connect to same origin — Vite proxy forwards /socket.io → localhost:4000
const socket = io('/', { path: '/socket.io' });

export default socket;
