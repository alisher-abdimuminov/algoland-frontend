import { useWebSocket } from "@/utils/ws";

export default defineNuxtPlugin((nuxtApp) => {
    const ws = useWebSocket();
    nuxtApp.provide("ws", ws);
});
