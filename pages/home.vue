<script setup lang="ts">

definePageMeta({
    layout: "default",
});


const { user } = useAuth();
const { theme } = useTheme();

const code = ref("");
const progress = ref(0);



onMounted(() => {
});
</script>

<template>
    <div class="p-5 md:p-10 flex flex-col gap-5">
        <NuxtLink to="sandbox">Sandbox</NuxtLink>
    </div>
</template>
