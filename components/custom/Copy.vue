<script setup lang="ts">
// imports
import { LucideCheckCheck, LucideCopy } from 'lucide-vue-next';


// interfaces and types
interface Props {
    value: string
}


// props, models, ...
const props = defineProps<Props>();


// composables
const { t } = useLang();


// variables
const copied = ref(false);


// functions
const copy = (value: string) => {
    navigator.clipboard.writeText(value);
    copied.value = true;
    setTimeout(() => {
        copied.value = false;
    }, 2000);
}
</script>

<template>
    <div v-tippy="{ content: !copied ? t('copy') : t('copied') }">
        <LucideCheckCheck v-if="copied" :size="15" class="text-green-500" />
        <LucideCopy v-else @click="copy(props.value)" :size="15" class="text-muted-foreground hover:text-foreground cursor-pointer" />
    </div>
</template>
