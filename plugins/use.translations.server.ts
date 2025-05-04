import { defineNuxtPlugin } from "#app";
import { useTranslationsStore } from "~/stores/translations";
import type { Language } from "~/types";

export default defineNuxtPlugin((nuxtApp) => {
    const translationsStore = useTranslationsStore();

    nuxtApp.hook("app:created", async () => {
        const { status, data } = await useAsyncData(
            "translation",
            () => $fetch<{ data: string }>(api("translations"))
        )
        if (status.value == "success") {
            if (data.value) {
                let decoded = jsonify<{ [lang: string]: Language }>(decode(data.value.data));
                if (decoded) {
                    translationsStore.set(decoded);
                }
            }
        }
    });
});
