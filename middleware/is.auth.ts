export default defineNuxtRouteMiddleware((from, to) => {
    const { user } = useAuth();

    if (user.value === null) {
        return navigateTo({ name: "auth-login", query: { next: to.path } });
    }
});
