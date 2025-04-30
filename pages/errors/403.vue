<script setup lang="ts">
definePageMeta({
    layout: "error",
});
</script>

<template>
    <div class="flex flex-col gap-3 text-center">
        <p class="text-7xl text-orange-500 font-bold">403</p>
        <p class="text-3xl">Ruxsat berilmadi</p>
        <p class="text-sm">Sizda ushbu sahifaga kirish huquqi yo'q.</p>
        <Button @click="navigateTo({ name: 'home' })">Bosh sahifaga qaytish</Button>
    </div>
</template>