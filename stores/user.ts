import type { IProfile } from "~/types";

export const useUserStore = defineStore("user", {
    state: (): { profile: IProfile | null } => ({
        profile: null
    }),

    actions: {
        set(profile: IProfile){
            this.profile = profile;
        }
    }
});
