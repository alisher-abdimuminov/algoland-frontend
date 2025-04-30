// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: false },
    modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', "nuxt-monaco-editor", "@pinia/nuxt", "nuxt-tour", "@nuxt/fonts",],
    css: ['~/assets/css/fullcalendar.css',],
    components: [
        { path: "~/icons", global: true },
        { path: "~/components", global: true },
        { path: "~/components/custom", global: true },
        { path: "~/components/mark", global: true },
    ],

    shadcn: {
        prefix: "",
    },

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    app: {
        head: {
            link: [
                { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png" },
                { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon/favicon-32x32.png" },
                { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon/favicon-16x16.png" },
                { rel: "manifest", href: "/favicon/site.webmanifiest" },
                { rel: "icon", sizes: "192x192", href: "/favicon/android-chrome-192x192.png" },
                { rel: "icon", sizes: "512x512", href: "/favicon/android-chrome-512x512.png" },
            ]
        }
    },

    runtimeConfig: {
        public: {
            api: "",
            base: "",
            storage: "",
        }
    },
});