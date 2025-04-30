<script setup lang="ts">
import { LucideCircle, LucideCircleCheckBig } from 'lucide-vue-next';

interface Props {
    checked?: boolean | null;
}

defineProps<Props>();
</script>

<template>
    <li :class="{ 'flex flex-wrap items-center gap-1': checked !== null }">
        <LucideCircleCheckBig v-if="checked === true" :size="16" class="text-green-500" />
        <LucideCircle v-else-if="checked === false" :size="16" />
        <slot />
    </li>
</template>
