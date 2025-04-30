import type { IResponse } from "~/types";
import type { IPost } from "~/types/post";

export default defineNuxtRouteMiddleware(async(to, from) => {
    const { user } = useAuth();

    const postStore = usePostStore();
    
    const response = await $fetch<IResponse>(api(`posts/post/${to.params.uuid}`), {
        headers: {
            ...(user.value ? { Authorization: `Token ${user.value.token}` } : {})
        }
    });
    if (response.status === "error") {
        return navigateTo({ name: 'errors-404' });
    } else {
        let decoded = jsonify<IPost>(decode(response.data));
        if (decoded) {
            postStore.set(decoded);
        }
    }
});
