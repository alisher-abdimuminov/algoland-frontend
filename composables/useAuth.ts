import type { Response } from "~/types";
import type { User } from "~/types/auth";


export default function useAuth() {
    const ws = useWs();

    const userCookie = useCookie("user", {
        sameSite: "lax",
        default: () => "",
        maxAge: 60*60*24
    });

    const user = computed({
        get() {
            return jsonify<User>(decode(userCookie.value));
        },
        set(value: string) {
            userCookie.value = value;
        }
    });

    const logout = async () => {
        if (user.value) {
            let response = await $fetch<Response>(api(`auth/logout`), {
                method: "POST",
                headers: {
                    Authorization: `Token ${user.value.token}`
                },
                body: JSON.stringify({
                    "data": encode(JSON.stringify({
                        "session": user.value.session
                    }))
                })
            });
            
            if (response.status === "error") {
                return;
            } else {
                ws.close();
                userCookie.value = "";
            }
        }
    };

    return {
        user,
        logout,
    }
}
