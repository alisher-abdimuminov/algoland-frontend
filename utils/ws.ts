import type { MessageCallback, WebSocketData } from "~/types";

class WebSocketConnector {
    private socket: WebSocket | null = null;
    private url: string;
    private reconnectInterval: number;
    private shouldReconnect: boolean = true;
    private messageListeners: MessageCallback<any>[] = [];

    constructor(url: string, reconnectInterval = 3000) {
        this.url = url;
        this.reconnectInterval = reconnectInterval;
        this.connect();
    }

    private connect(url: string = this.url) {
        this.socket = new WebSocket(url);

        this.socket.addEventListener("open", () => {
            console.log("[WS] Connected");
        });

        this.socket.addEventListener("close", () => {
            console.log("[WS] Disconnected");
            if (this.shouldReconnect) {
                setTimeout(() => this.connect(), this.reconnectInterval);
            }
        });

        this.socket.addEventListener("message", (event) => {
            let decoded = jsonify<WebSocketData<string>>(decode((event.data)));
            if (decoded) {
                this.messageListeners.forEach((callback) => callback(decoded));
            }
        });

        this.socket.addEventListener("error", (e) => {
            console.error("[WS] Error", e);
        });
    }

    public sendMessage<T>(message: WebSocketData<T>) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(encode(JSON.stringify(message)));
        } else {
            console.warn("[WS] Cannot send, socket not open");
        }
    }

    public onMessage<T>(callback: MessageCallback<T>) {
        this.messageListeners.push(callback);
    }

    public close() {
        console.log("[WS] Closed");
        this.shouldReconnect = false;
        this.socket?.close();
    }

    public reconnect() {
        console.log("[WS] Reconnecting...");
        this.shouldReconnect = true;
        this.close();
        const { user } = useAuth();
        console.log("user", user.value);
        setTimeout(() => this.connect(`ws://localhost:8000/ws/?token=${user.value?.token}`), 1000);
    }
}

let instance: WebSocketConnector | null = null;

export function useWebSocket(): WebSocketConnector {
    const { user } = useAuth();
    if (!instance) {
        instance = new WebSocketConnector(`ws://localhost:8000/ws/?token=${user.value?.token}`);
    }
    return instance;
}
