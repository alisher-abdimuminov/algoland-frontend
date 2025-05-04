import { defineNuxtPlugin } from "#app";
import type { Response } from "~/types";
import type { User } from "~/types/auth";


export default defineNuxtPlugin((nuxtApp) => {
    const { user, logout } = useAuth();

    if (user.value === null) {
        logout();
    } else {
        nuxtApp.hook("app:created", async () => {
            const { status, data } = await useAsyncData(
                "profile",
                () => $fetch<Response>(api("auth/profile"), {
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
                        let decoded = jsonify<User>(decode(data.value.data));
                        if (decoded) {
                            user.value = data.value.data;
                        }
                    }
                }
            }
        });
    }
});
