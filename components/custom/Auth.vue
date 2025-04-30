<script setup lang="ts">

interface Props {
    isAuth: boolean;
}

const route = useRoute();

const props = defineProps<Props>();

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