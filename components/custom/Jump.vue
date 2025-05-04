<script setup lang="ts">
// imports
import { LucideCheck, LucideHome, LucideMoon, LucideSun } from 'lucide-vue-next';


// props, models, ...
const props = defineProps({
    shortcut: {
        type: String,
        required: true,
    }
});

// stores
const translationsStore = useTranslationsStore();


// composables
const { lang, t } = useLang();
const { theme } = useTheme();


// variables
const isOpen = ref(false);


// functions
const handleIsOpenChange = () => {
    isOpen.value = !isOpen.value;
}


// hooks
onMounted(() => {
    window.onkeydown = (event) => {
        if (event.key === props.shortcut) {
            handleIsOpenChange();
        }
    }
});
</script>

<template>
    <div>
        <CommandDialog v-model:open="isOpen">
            <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <CommandInput />
            <CommandList>
                <CommandEmpty as-child>
                    <Empty />
                </CommandEmpty>
                <CommandGroup>
                    <CommandItem value="home">
                        <LucideHome />
                        <span>{{ t("home") }}</span>
                    </CommandItem>
                    <CommandItem value="problems">
                        <LucideHome />
                        <span>{{ t("problems") }}</span>
                    </CommandItem>
                    <CommandItem value="contests">
                        <LucideHome />
                        <span>{{ t("contests") }}</span>
                    </CommandItem>
                    <CommandItem value="users">
                        <LucideHome />
                        <span>{{ t("users") }}</span>
                    </CommandItem>
                    <CommandItem value="attempts">
                        <LucideHome />
                        <span>{{ t("attempts") }}</span>
                    </CommandItem>
                    <CommandItem value="posts">
                        <LucideHome />
                        <span>{{ t("posts") }}</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Theme">
                    <CommandItem value="dark" @click="theme = 'dark'">
                        <LucideMoon />
                        <span>{{ t("dark") }}</span>
                        <CommandShortcut v-if="theme === 'dark'">
                            <LucideCheck />
                        </CommandShortcut>
                    </CommandItem>
                    <CommandItem value="light" @click="theme = 'light'">
                        <LucideSun />
                        <span>{{ t("light") }}</span>
                        <CommandShortcut v-if="theme === 'light'">
                            <LucideCheck />
                        </CommandShortcut>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                    <CommandItem v-for="language in translationsStore.langs" :value="language.code" @click="lang = language.code">
                        {{ language.flag }}
                        <span>{{ language.name }}</span>
                        <CommandShortcut v-if="lang === language.code">
                            <LucideCheck />
                        </CommandShortcut>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    </div>
</template>
