<script setup lang="ts">
import { LucideCheckCheck, LucideCopy } from 'lucide-vue-next';


interface Props {
    value: string
}

const props = defineProps<Props>();

const copied = ref(false);


const copy = (value: string) => {
    navigator.clipboard.writeText(value);
    copied.value = true;
    setTimeout(() => {
        copied.value = false;
    }, 2000);
}

</script>

<template>
    <div>
        <LucideCheckCheck v-if="copied" :size="15" class="text-green-500" />
        <LucideCopy v-else @click="copy(props.value)" :size="15" class="text-muted-foreground hover:text-foreground cursor-pointer" />
    </div>
</template>
