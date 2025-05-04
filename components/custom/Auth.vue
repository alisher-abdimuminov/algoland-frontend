<script setup lang="ts">
// interfaces and types
interface Props {
    isAuth: boolean;
}

// props, models, ...
const props = defineProps<Props>();

// composables
const route = useRoute();

// local composables
const { user } = useAuth();


if (props.isAuth) {
    watch(user, () => {
        if (!user.value) {
            navigateTo({ name: "auth-login", query: { next: route.path } });
        }
    });
} else {
    watch(user, () => {
        if (user.value) {
            if (route.query.next) {
                navigateTo(route.query.next as string);
            } else {
                navigateTo({ name: "index" });
            }
        }
    });
}
</script>

<template>
    <div>
        <slot />
    </div>
</template>
