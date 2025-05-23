export default defineNuxtRouteMiddleware((from, to) => {
    const { user } = useAuth();

    if (user.value !== null || user.value) {
        if (to.query.next) {
            return navigateTo(to.query.next.toString());
        } else {
            return navigateTo({ name: "index" });
        }
    }
});
