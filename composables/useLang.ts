export default function useLang() {
    const translationsStore = useTranslationsStore();
    
    const langCookie = useCookie<string>("lang", {
        sameSite: "lax",
        default: () => "uz"
    });

    const lang = computed({
        get() {
            return langCookie.value;
        },
        set(value) {
            langCookie.value = value;
        }
    });

    const langInfo = computed(() => {
        return translationsStore.langs.filter(l => l.code === lang.value)[0];
    });

    return {
        lang,
        langInfo,
        t: translationsStore.t
    }
}
