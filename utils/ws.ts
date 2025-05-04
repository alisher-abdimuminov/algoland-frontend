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
    }

    public connect(token: string) {
        this.socket = new WebSocket(this.url + token);

        this.socket.addEventListener("open", () => {
            console.log("Ulandi");
        });

        this.socket.addEventListener("close", () => {
            console.log("Uzildi");
            if (this.shouldReconnect) {
                setTimeout(() => this.connect(token), this.reconnectInterval);
            }
        });

        this.socket.addEventListener("message", (event) => {
            let decoded = jsonify<WebSocketData<string>>(decode((event.data)));
            if (decoded) {
                this.messageListeners.forEach((callback) => callback(decoded));
            }
        });

        this.socket.addEventListener("error", (e) => {
            console.error("Xatolik", e);
        });
    }

    public sendMessage<T>(message: WebSocketData<T>) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(encode(JSON.stringify(message)));
        } else {
            console.warn("Yuborilmadi. Ulanish ochiq emas.");
        }
    }

    public onMessage<T>(callback: MessageCallback<T>) {
        this.messageListeners.push(callback);
    }

    public close() {
        console.log("Yopildi");
        this.shouldReconnect = false;
        this.socket?.close();
    }
}

let instance: WebSocketConnector | null = null;

export function useWebSocket(): WebSocketConnector {
    const { user } = useAuth();
    const config = useRuntimeConfig();
    let wsUrl: string = "";

    if (config.public.isProduction) {
        wsUrl = config.public.production.wss;
    } else {
        wsUrl = config.public.deployment.ws;
    }
    
    if (!instance) {
        instance = new WebSocketConnector(`${wsUrl}/?token=`);
    }
    return instance;
}
