import type { IResponse } from "~/types";
import type { IPostTag } from "~/types/post";

export default defineNuxtRouteMiddleware(async(to, from) => {
    const postTags = usePostTagsStore();

    const { tags } = storeToRefs(postTags);

    if (tags.value.length === 0) {
        const response = await $fetch<IResponse>(api(`posts/tags`));
        if (response.status === "error") {
            return navigateTo({ name: 'index' });
        } else {
            let decoded = jsonify<IPostTag[]>(decode(response.data));
            if (decoded) {
                postTags.set(decoded);
            }
        }
    }
});
