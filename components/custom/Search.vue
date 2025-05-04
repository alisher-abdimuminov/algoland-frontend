<script setup lang="ts">
// imports
import { LucideSearch } from 'lucide-vue-next';


// props, models, ...
const search = defineModel({ type: String, required: true });
const props = defineProps<{ onInput: void, isWaiting: boolean }>();


// composables
const { t } = useLang();
</script>

<template>
    <div class="relative">
        <Input class="pl-8" v-model="search" @input="onInput" v-on:keyup.enter="onInput" :placeholder="t('search')" />
        <div class="absolute top-0 left-0 w-8 h-full flex items-center justify-center">
            <Loader v-if="isWaiting" class="w-4 h-4" />
            <LucideSearch v-else :size="15" />
        </div>
    </div>
</template>