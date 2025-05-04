import type { Response } from "~/types";
import type { Problem } from "~/types/problem";


export default defineNuxtRouteMiddleware(async(to, from) => {
    const { user } = useAuth();

    const problemStore = useProblemStore();
    
    const response = await $fetch<Response>(api(`problems/problem/${to.params.uuid}`), {
        headers: {
            ...(user.value ? { Authorization: `Token ${user.value.token}` } : {})
        }
    });
    if (response.status === "error") {
        return navigateTo({ name: 'errors-404' });
    } else {
        let decoded = jsonify<Problem>(decode(response.data));
        if (decoded) {
            problemStore.set(decoded);
        }
    }
});
