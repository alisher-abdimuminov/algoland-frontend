import type { Response } from "~/types";
import type { ProgrammingLanguage } from "~/types/problem";


export default defineNuxtRouteMiddleware(async(to, from) => {
    const languagesStore = useLanguagesStore();

    const { languages } = storeToRefs(languagesStore);

    if (languages.value.length === 0) {
        const response = await $fetch<Response>(api(`languages`));
        if (response.status === "error") {
            return navigateTo({ name: 'index' });
        } else {
            let decoded = jsonify<ProgrammingLanguage[]>(decode(response.data));
            if (decoded) {
                languagesStore.push(decoded);
            }
        }
    }
});
