export default function useShortcuts() {
    const shortcutsCookie = useCookie<{[key: string]: string}>("shortcuts", {
        sameSite: "lax",
        default: () => ({
            "jump": "Escape",
        }),
    });

    const shortcuts = computed(() => {
        return shortcutsCookie.value;
    });

    const getShortcut = (shortcut: string, elseif: string = 'Escape') => {
        return shortcutsCookie.value[shortcut] ? shortcutsCookie.value[shortcut] : elseif;
    }

    const setShortcut = (shortcut: string, key: string) => {
        shortcutsCookie.value[shortcut] = key;
    }

    return {
        shortcuts,
        getShortcut,
        setShortcut,
    }
}
