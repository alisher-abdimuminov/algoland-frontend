<script setup lang="ts">
// imports
import { Icon } from "@iconify/vue";
import { LucideBlocks, LucideCode, LucideCog, LucideCommand } from "lucide-vue-next";

import { langIcons } from '~/utils/consts';
import { nodes } from "~/test";



definePageMeta({
    layout: "landing",
});


// Composables
const config = useRuntimeConfig();

const { lang } = useLang();
const { user } = useAuth();
const { theme } = useTheme();
const { shortcuts } = useShortcuts();

// stores
const translationsStore = useTranslationsStore();

const { t, langs } = translationsStore;


</script>

<template>
    <div class="flex flex-col gap-10 px-5 md:px-24">
        <div class="min-h-[40rem] flex flex-col items-center justify-center gap-5 place-content-center overflow-hidden">
            <div class="z-10 flex items-center gap-1 border rounded-full px-2 py-1 bg-accent/30">
                <span class="relative flex items-center justify-center size-3">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75 duration-1000"></span>
                    <span class="relative inline-flex size-2 rounded-full bg-green-500"></span>
                </span>                
                <span class="text-xs font-bold font-mono">Lets start with</span>
            </div>
            <h1 class="z-10 text-3xl md:text-5xl lg:text-7xl text-center font-bold">Sharpen your coding skills with algoland</h1>
            <p class="z-10 text-sm text-center">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequatur excepturi facilis maiores!</p>
            <div class="z-10 flex gap-2">
                <Button @click="navigateTo({ name: 'home' })">Getting start</Button>
                <Button @click="lang = 'en'" variant="outline">Docs</Button>
            </div>
        </div>

        <div class="border rounded-md p-5 flex flex-col md:flex-row gap-5">
            <div class="flex flex-col gap-2 w-full">
                <div class="border rounded-md bg-accent/30 p-2 flex items-center justify-center w-10 h-10">
                    <LucideBlocks />
                </div>
                <p class="text-2xl font-bold">Zamonaviy ko'rinish</p>
                <p class="text-muted-foreground">Barcha zamonaviy dasturlash tillarini qo'llab quvvatlaymiz.</p>
            </div>
            <div>
                Salom
            </div>
        </div>
        <div class="border rounded-md p-5 flex flex-col md:flex-row gap-5">
            <div class="flex flex-col gap-2 w-full">
                <div class="border rounded-md bg-accent/30 p-2 flex items-center justify-center w-10 h-10">
                    <LucideCog />
                </div>
                <p class="text-2xl font-bold">Sozlamalar</p>
                <p class="text-muted-foreground">Barcha zamonaviy dasturlash tillarini qo'llab quvvatlaymiz.</p>
            </div>
            <div>
                Salom
            </div>
        </div>
        <div class="border rounded-md p-5 flex flex-col md:flex-row gap-5">
            <div class="flex flex-col gap-2 w-full">
                <div class="border rounded-md bg-accent/30 p-2 flex items-center justify-center w-10 h-10">
                    <LucideCommand />
                </div>
                <p class="text-2xl font-bold">Tezkor tugmalar</p>
                <p class="text-muted-foreground">Barcha zamonaviy dasturlash tillarini qo'llab quvvatlaymiz.</p>
            </div>
            <div>
                Salom 
            </div>
        </div>
        <div class="border rounded-md p-5 flex flex-col md:flex-row gap-5">
            <div class="flex flex-col gap-2 w-full">
                <div class="border rounded-md bg-accent/30 p-2 flex items-center justify-center w-10 h-10">
                    <LucideCode />
                </div>
                <p class="text-2xl font-bold">Dasturlash tillari</p>
                <p class="text-muted-foreground">Barcha zamonaviy dasturlash tillarini qo'llab quvvatlaymiz.</p>
            </div>
            <div class="relative w-full md:w-1/2">
                <Marquee pause-on-hover class="[--duration:20s]">
                    <div class="flex gap-2">
                        <div v-for="icons in chunks<string>(langIcons, 4)" class="grid grid-cols-2 grid-rows-2 gap-2 p-2 rounded-md">
                            <div v-for="icon in icons" class="rounded-md bg-accent p-2 text-2xl">
                                <component :is="icon" class="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </Marquee>
                <div class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
                <div class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
            </div>
        </div>
        <div class="mx-5 md:mx-24 border-2 border-dashed bg-accent/30 p-5 flex flex-col gap-5">
            <p class="text-2xl">Lorem ipsum dolor, sit amet consectetur adipisicing.</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis quidem dolores ea. Aliquam debitis aperiam odit ducimus voluptate repellat quisquam dolorum. Quibusdam, ab unde.</p>
            <Button class="w-fit">Get started</Button>
        </div>
    </div>
</template>
