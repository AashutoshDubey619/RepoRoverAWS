import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { getSocketURL } from '../utils/api';

/**
 * Manages the Socket.io connection lifecycle.
 * Connects on mount, disconnects on unmount.
 * @param {Function} onLog - callback fired on every 'log' event from the server
 */
export default function useSocket(onProgress) {
    useEffect(() => {
        const socket = io(getSocketURL(), {
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('progress', onProgress);
        socket.on('connect_error', (err) => console.error('Socket Error:', err.message));

        return () => socket.disconnect();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
