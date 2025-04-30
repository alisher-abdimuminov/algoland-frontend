export default function useWs(): ReturnType<typeof useWebSocket> {
    const nuxtApp = useNuxtApp();
    const ws = <ReturnType<typeof useWebSocket>> nuxtApp.$ws;
    return ws;
};
