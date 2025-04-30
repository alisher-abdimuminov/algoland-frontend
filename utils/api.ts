
export default function api(path: string, params: Record<string, string | number> = {}, type: "api" | "base" | "storage" = "api",): string {
    const config = useRuntimeConfig();

    if (type === "api") {
        const url = new URL(`${config.public.api}/${path}/`);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value.toString());
        });
        return url.toString();
    } else if (type === "base") {
        const url = new URL(`${config.public.base}/${path}/`);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value.toString());
        });
        return url.toString();
    } else {
        const url = new URL(`${config.public.storage}/${path}/`);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value.toString());
        });
        return url.toString();
    }
}
