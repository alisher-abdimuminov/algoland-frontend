<template>
    <div class="relative">
        <div class="absolute inset-0 bg-[radial-gradient(theme(colors.border/90%)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_50%,transparent_100%)]" />
        <div class="relative z-10 flex flex-col items-center justify-center py-16 text-center lg:py-24">
            <slot name="icon">
                <LucideSearch />
                </slot>
            <slot name="title">
                <p class="mb-2 mt-6 text-balance text-xl font-bold tracking-tight" v-html="props.title" />
            </slot>
            <slot name="description">
                <p class="text-muted-foreground" v-html="props.description" />
            </slot>
            <slot>
                <p>:(</p>
            </slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { LucideSearch } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        title?: string;
        description?: string;
        icon?: string;
    }>(),
    {
        icon: "lucide:search",
        title: "Hech qanday natija topilmadi",
        description: "Try changing your search query or adding a new record.",
    }
);
</script>
