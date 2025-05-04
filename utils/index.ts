import type { TranslatedContent } from "~/types/problem";

export function api(path: string, query?: Record<string, string | number | boolean>, type: "api" | "base" | "storage" = "api"): string {
    const config = useRuntimeConfig();
    
    let baseUrl;
    
    if (type === "api") {
        baseUrl = config.public.isProduction ? config.public.production.api : config.public.deployment.api;
    } else if (type === "base") {
        baseUrl = config.public.isProduction ? config.public.production.base : config.public.deployment.base;
    } else {
        baseUrl = config.public.isProduction ? config.public.production.storage : config.public.deployment.storage;
    }

    const queryString = query ? `?${new URLSearchParams(query as Record<string, string>).toString()}` : "/";
    return `${baseUrl}/${path}${queryString}`;
}


export function* chunks<T>(arr: T[], n: number) {
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n);
    }
}


export const randomID = (length: number = 6) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
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


export const getCountryByCode = (code: string) => {
    return countries.find((country) => country.code === code);
}


export function lastSeen(timestamp: string | number): string {
    const { t } = useLang();

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
        return t("%s_seconds_ago").replace("%s", `${diff}`);
    } else if (diff < 3600) {
        return t("%m_minutes_%s_seconds_ago").replace("%m", `${Math.floor(diff / 60)}`).replace("%s", `${seconds}`); `${Math.floor(diff / 60)} daqiqa ${seconds} soniya oldin`;
    } else if (diff < 86400) {
        return t("%h_hours_%m_minutes_ago").replace("%h", `${Math.floor(diff / 3600)}`).replace("%m", `${minutes}`); `${Math.floor(diff / 3600)} soat ${minutes} daqiqa oldin`;
    } else if (diff < 2592000) {
        return t("%d_days_%h_hours_ago").replace("%d", `${Math.floor(diff / 86400)}`).replace("%h", `${hours}`); `${Math.floor(diff / 86400)} kun ${hours} soat oldin`;
    } else if (diff < 31536000) {
        return t("%n_months_ago").replace("%n", `${Math.floor(diff / (86400 * 30))}`); `${Math.floor(diff / (86400 * 30))} oy oldin`;
    } else {
        return t("%n_years_ago").replace("%n", `${Math.floor(diff / (86400 * 365))}`); `${Math.floor(diff / (86400 * 365))} yil oldin`;
    }
}


export function formatDateTime(date: string, time: boolean = false) {
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


export const getTranslatedContent = (content: TranslatedContent, defaultLang: string) => {
    const { lang } = useLang();

    if (content[lang.value]) {
        return content[lang.value];
    } else {
        return content[defaultLang];
    }
}
