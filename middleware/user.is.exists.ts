import { useUserStore } from "#imports";
import type { IProfile, IResponse } from "~/types";

export default defineNuxtRouteMiddleware(async(to, from) => {
    const userStore = useUserStore();
    
    const response = await $fetch<IResponse>(api(`users/${to.params.username}`));
    if (response.status === "error") {
        return navigateTo({ name: 'index' });
    } else {
        let decoded = jsonify<IProfile>(decode(response.data));
        if (decoded) {
            userStore.set(decoded);
        }
    }
});
