import type { Response } from "~/types";
import type { Tag } from "~/types/problem";


export default defineNuxtRouteMiddleware(async(to, from) => {
    const problemTags = useProblemTagsStore();

    const { tags } = storeToRefs(problemTags);

    if (tags.value.length === 0) {
        const response = await $fetch<Response>(api(`problems/tags`));
        if (response.status === "error") {
            return navigateTo({ name: 'index' });
        } else {
            let decoded = jsonify<Tag[]>(decode(response.data));
            if (decoded) {
                problemTags.push(decoded);
            }
        }
    }
});
