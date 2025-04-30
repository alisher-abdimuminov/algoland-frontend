import { defineNuxtPlugin } from "#app";
import type { IResponse, IUser } from "~/types";

export default defineNuxtPlugin((nuxtApp) => {
    const { user, logout } = useAuth();

    if (user.value === null) {
        logout();
    } else {
        nuxtApp.hook("app:created", async () => {
            const { status, data } = await useAsyncData(
                "profile",
                () => $fetch<IResponse>(api("auth/profile"), {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${user.value?.token}`,
                    },
                    query: {
                        data: encode(JSON.stringify({
                            "token": user.value?.token,
                            "session": user.value?.session,
                        }))
                    }
                })
            )
            if (status.value == "success") {
                if (data.value) {
                    if (data.value.status === "error") {
                        logout();
                    } else {
                        let decoded = jsonify<IUser>(decode(data.value.data));
                        if (decoded) {
                            user.value = data.value.data;
                        }
                    }
                }
            }
        });
    }
});
