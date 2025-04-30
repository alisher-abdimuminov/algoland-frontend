<template>
    <NuxtLink
        :to="props.to"
        target="_blank"
        :external="true"
        class="font-semibold underline underline-offset-4"
    >
        <slot />
    </NuxtLink>
</template>
  
<script setup lang="ts">

interface Props {
    to: string
}
const props = defineProps<Props>();
</script>