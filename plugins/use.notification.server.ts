import type { IResponse } from "~/types";
import type { WSNotification } from "~/types/codes";

export default defineNuxtPlugin((nuxtApp) => {
    const { user, logout } = useAuth();

    const notificationsStore = useNotificationsStore();

    if (user.value === null) {
        
    } else {
        nuxtApp.hook("app:created", async () => {
            const { status, data } = await useAsyncData(
                "notifications",
                () => $fetch<IResponse>(api("notifications"), {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${user.value?.token}`,
                    },
                })
            )
            if (status.value == "success") {
                if (data.value) {
                    if (data.value.status === "error") {
                        logout();
                    } else {
                        let decoded = jsonify<WSNotification[]>(decode(data.value.data));
                        if (decoded) {
                            decoded.forEach((value) => {
                                notificationsStore.push(value);
                            })
                        }
                    }
                }
            }
        });
    }
});
