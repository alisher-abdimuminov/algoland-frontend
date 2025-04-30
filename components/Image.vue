<script setup lang="ts">
import type { IResponse } from '~/types';


interface Props {
    uuid: string;
}


const props = defineProps<Props>();

const isLoading = ref(true);
const url = ref<string>("");


const download = async () => {
    let response = await $fetch<Blob>(api(`api/v1/download/${encode(JSON.stringify({ uuid: props.uuid, token: crypto.randomUUID() },))}`, { }, "storage"), {
        method: "GET",
    });
    
    url.value = URL.createObjectURL(response);
    isLoading.value = false;
}


onMounted(() => {
    download();
});
</script>

<template>
    <Skeleton v-if="isLoading" class="w-full h-32" />
    <img v-else :src="url" alt="This is image" />
</template>