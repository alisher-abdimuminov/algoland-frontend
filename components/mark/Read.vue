<script setup lang="ts">
import { LucideArrowUpRight, LucideGlobe } from 'lucide-vue-next';

 
interface Props {
    to: string
}

const props = defineProps<Props>();
</script>

<template>
    <div @click="navigateTo(to, { external: true, open: { target: '_blank' } })" class="border rounded-md p-3 my-1 gap-2 hover:bg-accent/50 cursor-pointer flex items-center justify-between">
        <LucideGlobe :size="20" />
        <div class="flex-1 flex items-center justify-between">
            <p class="font-normal">{{ to }}</p>
            <LucideArrowUpRight :size="20" />
        </div>
    </div>
</template>