import { useUserStore } from "#imports";
import type { Response } from "~/types";
import type { User } from "~/types/auth";


export default defineNuxtRouteMiddleware(async(to, from) => {
    const userStore = useUserStore();
    
    const response = await $fetch<Response>(api(`users/${to.params.username}`));
    if (response.status === "error") {
        return navigateTo({ name: 'index' });
    } else {
        let decoded = jsonify<User>(decode(response.data));
        if (decoded) {
            userStore.set(decoded);
        }
    }
});
