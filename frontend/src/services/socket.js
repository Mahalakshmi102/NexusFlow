import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

// Create a singleton socket connection
export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('[NexusFlow Socket] Connected to backend:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('[NexusFlow Socket] Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('[NexusFlow Socket] Connection Error:', error.message);
});
