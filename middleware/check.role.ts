export default defineNuxtRouteMiddleware(async(to, from) => {
    const { user } = useAuth();
    
    const problemStore = useProblemStore();

    const { problem } = storeToRefs(problemStore);


    const type = to.meta.type;
    const object = to.meta.object;

    if (type === "edit") {
        if (user.value === null) {
            return navigateTo({ name: "errors-404" });
        } else {
            if (user.value.role !== "admin") {
                // problem
                if (object === "problem") {
                    if (!problem.value) {
                        return navigateTo({ name: "errors-404" });
                    } else {
                        if (problem.value.author.uuid !== user.value.uuid) {
                            return navigateTo({ name: "errors-403" });
                        }
                    }
                }
            }
        }
    }
});
