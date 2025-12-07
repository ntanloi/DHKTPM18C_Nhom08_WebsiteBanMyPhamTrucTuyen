import { Client, type StompSubscription, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export type MessageHandler = (message: unknown) => void;

export class WebSocketService {
    private client: Client | null = null;
    private subscriptions: Map<string, StompSubscription> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 3000;
    private url: string;
    private onConnected?: () => void;
    private onDisconnected?: () => void;
    private onError?: (error: unknown) => void;
    
    constructor(
        url: string,
        onConnected?: () => void,
        onDisconnected?: () => void,
        onError?: (error: unknown) => void
    ) {
        this.url = url;
        this.onConnected = onConnected;
        this.onDisconnected = onDisconnected;
        this.onError = onError;
    }

    connect(token?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client = new Client({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                webSocketFactory: () => new SockJS(this.url) as any,
                connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
                debug: (str) => {
                    if (import.meta.env.DEV) {
                        console.log('[WebSocket Debug]', str);
                    }
                },
                reconnectDelay: this.reconnectDelay,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    console.log('✅ WebSocket connected');
                    this.reconnectAttempts = 0;
                    this.onConnected?.();
                    resolve();
                },
                onDisconnect: () => {
                    console.log('❌ WebSocket disconnected');
                    this.onDisconnected?.();
                },
                onStompError: (frame) => {
                    console.error('❌ WebSocket error:', frame);
                    this.onError?.(frame);
                    const errorMessage = frame.headers?.['message'] || 'WebSocket error';
                    reject(new Error(errorMessage));
                },
                onWebSocketClose: (evt) => {
                    console.warn('⚠️ WebSocket closed:', evt.reason);
                    this.handleReconnect();
                }
            });

            this.client.activate();
        });
    }

    private handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => {
                this.client?.activate();
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('❌ Max reconnect attempts reached');
            this.onError?.(new Error('Failed to reconnect after maximum attempts'));
        }
    }

    subscribe(destination: string, callback: MessageHandler): string {
        if (!this.client?.connected) {
            console.warn('⚠️ Cannot subscribe, client not connected');
            return '';
        }

        const subscriptionId = `sub-${Date.now()}-${Math.random()}`;
        const subscription = this.client.subscribe(destination, (message: IMessage) => {
            try {
                const data = JSON.parse(message.body);
                callback(data);
            } catch (error) {
                console.error('❌ Error parsing message:', error);
                callback(message.body);
            }
        });

        this.subscriptions.set(subscriptionId, subscription);
        console.log(`📨 Subscribed to ${destination}`);
        return subscriptionId;
    }

    unsubscribe(subscriptionId: string) {
        const subscription = this.subscriptions.get(subscriptionId);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(subscriptionId);
            console.log(`📭 Unsubscribed: ${subscriptionId}`);
        }
    }

    send(destination: string, body: unknown) {
        if (!this.client?.connected) {
            console.warn('⚠️ Cannot send, client not connected');
            return;
        }

        this.client.publish({
            destination,
            body: JSON.stringify(body)
        });
        console.log(`📤 Sent to ${destination}:`, body);
    }

    disconnect() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
        this.subscriptions.clear();
        this.client?.deactivate();
        console.log('👋 WebSocket disconnected');
    }

    isConnected(): boolean {
        return this.client?.connected ?? false;
    }
}

// Singleton instance
let wsInstance: WebSocketService | null = null;

export const getWebSocketService = (): WebSocketService => {
    if (!wsInstance) {
        const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';
        wsInstance = new WebSocketService(
            wsUrl,
            () => console.log('🟢 WebSocket ready'),
            () => console.log('🔴 WebSocket disconnected'),
            (error) => console.error('❌ WebSocket error:', error)
        );
    }
    return wsInstance;
};

export const disconnectWebSocket = () => {
    if (wsInstance) {
        wsInstance.disconnect();
        wsInstance = null;
    }
};
