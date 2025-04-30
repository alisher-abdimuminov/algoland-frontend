import type { IResponse } from "~/types";
import type { IProblemTag } from "~/types/problem";

export default defineNuxtRouteMiddleware(async(to, from) => {
    const problemTags = useProblemTagsStore();

    const { tags } = storeToRefs(problemTags);

    if (tags.value.length === 0) {
        const response = await $fetch<IResponse>(api(`problems/tags`));
        if (response.status === "error") {
            return navigateTo({ name: 'index' });
        } else {
            let decoded = jsonify<IProblemTag[]>(decode(response.data));
            if (decoded) {
                problemTags.push(decoded);
            }
        }
    }
});
