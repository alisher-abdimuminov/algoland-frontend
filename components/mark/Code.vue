<script setup lang="ts">
import { LucideCheckCheck, LucideCopy } from 'lucide-vue-next';
import { codeToHtml, bundledLanguages } from 'shiki'
import { 
    transformerNotationDiff, 
    transformerMetaHighlight,
    transformerNotationHighlight, 
    transformerNotationWordHighlight,
} from "@shikijs/transformers";


interface Props {
    lang: string
    code: string
    meta?: string | null
}


const props = defineProps<Props>();

const html = ref("");
const copied = ref(false);

html.value = await codeToHtml(props.code, {
    lang: props.lang in bundledLanguages ? props.lang : 'plaintext',
    themes: {
        light: "one-light",
        dark: "dark-plus"
    },
    transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
    ],
});


const copy = () => {
    navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => {
        copied.value = false;
    }, 2000);
}

</script>

<template>
    <div class="relative my-2">
        <div v-html="html" />
        <div @click="copy" class="absolute cursor-pointer top-1 right-1 p-2">
            <LucideCheckCheck v-if="copied" class="text-green-500" :size="16" />
            <LucideCopy v-else :size="16" />
        </div>
    </div>
</template>