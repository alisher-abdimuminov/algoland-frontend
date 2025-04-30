<script setup lang="ts">
definePageMeta({
    layout: "error",
});
</script>

<template>
    <div class="flex flex-col gap-3 text-center">
        <p class="text-7xl text-orange-500 font-bold">404</p>
        <p class="text-3xl">Sahifa topilmadi</p>
        <p class="text-sm">Kechirasiz, bu sahifa topilmadi.</p>
        <Button @click="navigateTo({ name: 'home' })">Bosh sahifaga qaytish</Button>
    </div>
</template>