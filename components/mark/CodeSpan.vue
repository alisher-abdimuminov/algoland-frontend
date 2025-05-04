<script setup lang="ts">
// interfaces and types
interface Props {
    value: string
}


// props, models, ...
const props = defineProps<Props>();


// composables
const { t } = useLang();


// functions
const hexColor = computed(() => {
    const match = props.value.match(/#([0-9a-fA-F]{3,6})\b/);
    return match ? match[0] : null;
});

const copy = () => {
    navigator.clipboard.writeText(props.value);
}
</script>

<template>
    <code v-tippy="{ content: t('copy') }" @click="copy" class="cursor-pointer p-1 text-xs border bg-accent/30 rounded-md inline-flex gap-1 items-center">
        <div v-if="hexColor" class="w-3 h-3 rounded-full" :style="{ backgroundColor: hexColor }"></div>
        {{ props.value }}
    </code>
</template>