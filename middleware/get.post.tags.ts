import type { Response } from "~/types";
import type { Tag } from "~/types/post";


export default defineNuxtRouteMiddleware(async(to, from) => {
    const postTags = usePostTagsStore();

    const { tags } = storeToRefs(postTags);

    if (tags.value.length === 0) {
        const response = await $fetch<Response>(api(`posts/tags`));
        if (response.status === "error") {
            return navigateTo({ name: 'index' });
        } else {
            let decoded = jsonify<Tag[]>(decode(response.data));
            if (decoded) {
                postTags.set(decoded);
            }
        }
    }
});
