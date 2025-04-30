export default defineNuxtPlugin((nuxtApp) => {
    const userAgent = process.server
        ? nuxtApp.ssrContext?.event.node.req.headers['user-agent'] || ''
        : navigator.userAgent;

    const isMobile = /Mobi|Android|iPhone/i.test(userAgent);
    const isTablet = /iPad|Tablet/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    return {
        provide: {
            device: isMobile || isTablet ? "mobile" : "desktop"
        }
    };
});
