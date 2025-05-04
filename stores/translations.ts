import type { Language } from "~/types";


export const useTranslationsStore = defineStore("translations", {
    state: (): { [lang: string]: Language } => ({}),

    getters: {
        langNames(): string[] {
            return Object.keys(this.$state);
        },
        langs(): { name: string, code: string, flag: string, locale: string }[] {
            return Object.values(this.$state).map(({ name, code, flag, locale }) => ({ name, code, flag, locale }));
        },
    },

    actions: {
        set(translations: { [lang: string]: Language }) {
            this.$state = translations;
        },
        t(key: string) {
            const { lang } = useLang();
            return this.$state[lang.value].translations[key] || key;
        },
    }
});
