import type { IResponse, IUser } from "~/types";

export default function useAuth() {
    const ws = useWs();

    const userCookie = useCookie("user", {
        sameSite: "lax",
        default: () => "",
        maxAge: 60*60*24
    });

    const user = computed({
        get() {
            return jsonify<IUser>(decode(userCookie.value));
        },
        set(value: string) {
            userCookie.value = value;
        }
    });

    const logout = async () => {
        let response = await $fetch<IResponse>(api(`auth/logout/${user.value?.session}`), {
            method: "POST",
            headers: {
                Authorization: `Token ${user.value?.token}`
            }
        });

        if (response.status === "error") {
            return;
        } else {
            ws.close();
            userCookie.value = "";
            setTimeout(() => {
                ws.reconnect();
            }, 1000);
        }
    };

    return {
        user,
        logout,
    }
}
