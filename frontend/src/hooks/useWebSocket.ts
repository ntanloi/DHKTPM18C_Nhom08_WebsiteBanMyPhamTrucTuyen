import { useEffect, useState, useCallback, useRef } from 'react';
import { getWebSocketService, type MessageHandler } from '../services/websocket';

interface UseWebSocketOptions {
    autoConnect?: boolean;
    token?: string;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const serviceRef = useRef(getWebSocketService());
    const subscriptionsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        const service = serviceRef.current;

        if (options.autoConnect !== false) {
            service.connect(options.token)
                .then(() => setConnected(true))
                .catch((err) => {
                    setError(err as Error);
                    setConnected(false);
                });
        }

        return () => {
            // Cleanup subscriptions
            subscriptionsRef.current.forEach(subId => {
                service.unsubscribe(subId);
            });
            subscriptionsRef.current.clear();
        };
    }, [options.autoConnect, options.token]);

    const subscribe = useCallback((destination: string, callback: MessageHandler) => {
        const service = serviceRef.current;
        const subId = service.subscribe(destination, callback);
        subscriptionsRef.current.add(subId);

        return () => {
            service.unsubscribe(subId);
            subscriptionsRef.current.delete(subId);
        };
    }, []);

    const send = useCallback((destination: string, body: unknown) => {
        serviceRef.current.send(destination, body);
    }, []);

    const connect = useCallback(async (token?: string) => {
        try {
            await serviceRef.current.connect(token);
            setConnected(true);
            setError(null);
        } catch (err) {
            setError(err as Error);
            setConnected(false);
            throw err;
        }
    }, []);

    const disconnect = useCallback(() => {
        serviceRef.current.disconnect();
        setConnected(false);
    }, []);

    return {
        connected,
        error,
        subscribe,
        send,
        connect,
        disconnect,
        isConnected: serviceRef.current.isConnected()
    };
};
