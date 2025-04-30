import type { WSNotification } from "~/types/codes";

export const useNotificationsStore = defineStore("notifications", {
    state: (): { notifications: WSNotification[] } => ({
        notifications: []
    }),

    actions: {
        unshift(notification: WSNotification) {
            this.notifications.unshift(notification);
        },
        push(notification: WSNotification) {
            this.notifications.push(notification);
        },
        read() {
            this.notifications = this.notifications.map((notification) => {
                return {
                    ...notification,
                    is_readed: true,
                }
            });
        },
        set(notifications: WSNotification[]) {
            this.notifications = notifications;
        }
    }
});