export default function format(date: string, time: boolean = false) {
    const { langInfo } = useLang();
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour12: false,

    };

    if (time) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
    }

    return new Date(date).toLocaleDateString(langInfo.value.locale, options);
}

export function lastSeen(timestamp: string | number): string {
    if (timestamp === "online") return "Online";

    const now = Math.floor(Date.now() / 1000);
    const diff = now - Number(timestamp);

    if (isNaN(diff) || diff < 0) return "Noma'lum";

    const seconds = diff % 60;
    const minutes = Math.floor(diff / 60) % 60;
    const hours = Math.floor(diff / 3600) % 24;
    const days = Math.floor(diff / 86400) % 30;
    const months = Math.floor(diff / (86400 * 30)) % 12;
    const years = Math.floor(diff / (86400 * 365));

    if (diff < 60) {
        return `${diff} soniya oldin`;
    } else if (diff < 3600) {
        return `${Math.floor(diff / 60)} daqiqa ${seconds} soniya oldin`;
    } else if (diff < 86400) {
        return `${Math.floor(diff / 3600)} soat ${minutes} daqiqa oldin`;
    } else if (diff < 2592000) {
        return `${Math.floor(diff / 86400)} kun ${hours} soat oldin`;
    } else if (diff < 31536000) {
        return `${Math.floor(diff / (86400 * 30))} oy oldin`;
    } else {
        return `${Math.floor(diff / (86400 * 365))} yil oldin`;
    }
}


export function getLocalizedWeekdays(type: "long" | "narrow" | "short" = "short"): string[] {
    const { langInfo } = useLang();
    const baseDate = new Date(Date.UTC(2024, 0, 1));
    const formatter = new Intl.DateTimeFormat(langInfo.value.locale, { weekday: type })

    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(baseDate)
        date.setDate(baseDate.getDate() + i)
        return formatter.format(date)
    })
}

