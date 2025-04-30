<script setup lang="ts">
import { LucideCheck, LucideHome, LucideMoon, LucideSun } from 'lucide-vue-next';


const props = defineProps({
    shortcut: {
        type: String,
        required: true,
    }
});

const translationsStore = useTranslationsStore();

const { lang } = useLang();
const { theme } = useTheme();

const isOpen = ref(false);


const handleIsOpenChange = () => {
    isOpen.value = !isOpen.value;
}


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
                        <span>Home</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Theme">
                    <CommandItem value="dark" @click="theme = 'dark'">
                        <LucideMoon />
                        <span>Dark</span>
                        <CommandShortcut v-if="theme === 'dark'">
                            <LucideCheck />
                        </CommandShortcut>
                    </CommandItem>
                    <CommandItem value="light" @click="theme = 'light'">
                        <LucideSun />
                        <span>Light</span>
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
