<template>
    <div class="relative">
        <div class="absolute inset-0 bg-[radial-gradient(theme(colors.border/90%)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_50%,transparent_100%)]" />
        <div class="relative z-10 flex flex-col items-center justify-center py-16 text-center lg:py-24">
            <slot name="icon">
                <LucideSearch />
                </slot>
            <p class="mb-2 mt-6 text-balance text-xl font-bold tracking-tight">{{ t("no_results_found") }}</p>
            <p class="text-muted-foreground">{{ t("change_search_query") }}</p>
            <slot>
                <p>:(</p>
            </slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
// imports
import { LucideSearch } from 'lucide-vue-next';


// composables
const { t } = useLang();
</script>
