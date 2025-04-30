<script setup lang="ts">
interface Props {
    href: string
    title?: string
}

const props = defineProps<Props>();
</script>

<template>
    <a :href="href" class="underline">
        <slot />
    </a>
</template>