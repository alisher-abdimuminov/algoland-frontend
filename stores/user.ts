import type { User } from "~/types/auth";


export const useUserStore = defineStore("user", {
    state: (): { profile: User | null } => ({
        profile: null
    }),

    actions: {
        set(profile: User){
            this.profile = profile;
        }
    }
});
