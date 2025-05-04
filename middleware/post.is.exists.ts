import type { Response } from "~/types";
import type { Post } from "~/types/post";


export default defineNuxtRouteMiddleware(async(to, from) => {
    const { user } = useAuth();

    const postStore = usePostStore();
    
    const response = await $fetch<Response>(api(`posts/post/${to.params.uuid}`), {
        headers: {
            ...(user.value ? { Authorization: `Token ${user.value.token}` } : {})
        }
    });
    if (response.status === "error") {
        return navigateTo({ name: 'errors-404' });
    } else {
        let decoded = jsonify<Post>(decode(response.data));
        if (decoded) {
            postStore.set(decoded);
        }
    }
});
