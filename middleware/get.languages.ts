import type { IResponse } from "~/types";
import type { ILanguage } from "~/types/problem";

export default defineNuxtRouteMiddleware(async(to, from) => {
    const languagesStore = useLanguagesStore();

    const { languages } = storeToRefs(languagesStore);

    if (languages.value.length === 0) {
        const response = await $fetch<IResponse>(api(`languages`));
        if (response.status === "error") {
            return navigateTo({ name: 'index' });
        } else {
            let decoded = jsonify<ILanguage[]>(decode(response.data));
            if (decoded) {
                languagesStore.push(decoded);
            }
        }
    }
});
