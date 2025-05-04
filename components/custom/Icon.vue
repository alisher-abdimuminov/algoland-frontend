<script setup lang="ts">
interface Props {
    name: string
}
const props = defineProps<Props>();

const isAllowed = computed(() => {
    return programmingLanguagesIcons.includes(props.name);
});
</script>

<template>
    <component v-if="isAllowed" :is="props.name" class="inline-flex" />
    <span v-else>:(</span>
</template>
