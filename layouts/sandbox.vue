<script setup lang="ts">
import { LucideBadgeCheck, LucideCheck, LucideChevronLeft, LucideChevronRight, LucideClock, LucideCode, LucideCommand, LucideCpu, LucideFileText, LucideFlaskConical, LucideHome, LucideLayers, LucideLayers2, LucideListRestart, LucideLogIn, LucideLogOut, LucideLogs, LucideMessageCircle, LucideMoon, LucidePalette, LucidePlay, LucideScrollText, LucideSearch, LucideStretchHorizontal, LucideStretchVertical, LucideSun, LucideTimer, LucideUser, LucideUserPen, LucideUserPlus, LucideUsers, LucideX } from 'lucide-vue-next';


const { theme } = useTheme();
const { user, logout } = useAuth();
const { lang, langInfo, t } = useLang();

const languagesStore = useLanguagesStore();
const translationsStore = useTranslationsStore();

const { languages } = storeToRefs(languagesStore);

const code = ref("");
const selectedLanguage = ref("");
const editorIsLoaded = ref(false);
const shortcutsIsOpen = ref(false);
const logOutDialogIsOpen = ref(false);
const direction = ref<"horizontal" | "vertical">("vertical");


onMounted(() => {
});

onUnmounted(() => {
});

</script>

<template>
    <div class="h-screen w-full">
        <header class="h-[3rem] w-full border-b flex items-center justify-between px-4">
            <div class="flex items-center gap-1">
                <Logo class="w-6 h-6" />
                <p class="font-bold">algoland</p>
            </div>
            <div>
                <ToggleGroup v-model:model-value="direction">
                    <ToggleGroupItem value="vertical">
                        <LucideStretchHorizontal />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="horizontal">
                        <LucideStretchVertical />
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger v-tippy="'Ro\'yxatni ochish'">
                        <LucideUser :size="16" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-64 mr-2">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Hisob</DropdownMenuLabel>
                            <DropdownMenuItem v-if="user">
                                <img :src="`/api/v1/avatar/${user.username}`" class="w-4 h-4 rounded-full"
                                    alt="alisher" />
                                <span class="truncate">{{ user.full_name }}</span>
                                <DropdownMenuShortcut v-if="user.is_premium">
                                    <LucideBadgeCheck :size="15" />
                                </DropdownMenuShortcut>
                                <DropdownMenuShortcut v-else>
                                    <LucideChevronRight :size="15" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="user" @click="$router.push({ name: 'profile-edit' })">
                                <LucideUserPen :size="15" />
                                <span>Tahrirlash</span>
                                <DropdownMenuShortcut>
                                    <LucideChevronRight :size="15" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="user" @click="$router.push({ name: 'prfile-sessions' })">
                                <LucideListRestart :size="15" />
                                <span>Tizimga kirishlar</span>
                                <DropdownMenuShortcut>
                                    <LucideChevronRight :size="15" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="!user"
                                @click="$router.push({ name: 'auth-login', query: { next: $route.path } })">
                                <LucideLogIn :size="15" />
                                <span>Kirish</span>
                                <DropdownMenuShortcut>
                                    <LucideChevronRight :size="15" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="!user"
                                @click="$router.push({ name: 'auth-signup', query: { next: $route.path } })">
                                <LucideUserPlus :size="15" />
                                <span>Ro'yxatdan o'tish</span>
                                <DropdownMenuShortcut>
                                    <LucideChevronRight :size="15" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem @click="shortcutsIsOpen = true">
                                <LucideLayers2 :size="15" />
                                <span>Tezkor tugmalar</span>
                                <DropdownMenuShortcut>
                                    <LucideChevronRight :size="15" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Mavzu</DropdownMenuLabel>
                            <DropdownMenuRadioGroup v-model:model-value="theme">
                                <DropdownMenuRadioItem value="dark">
                                    Qorong'u
                                    <DropdownMenuShortcut>
                                        <LucideMoon :size="15" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="light">
                                    Yorug'
                                    <DropdownMenuShortcut>
                                        <LucideSun :size="15" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Til</DropdownMenuLabel>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <p class="flex items-center gap-2">
                                        <span>{{ langInfo.flag }}</span>
                                        <span>{{ langInfo.name }}</span>
                                    </p>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent class="w-56">
                                        <DropdownMenuItem v-for="language in translationsStore.langs"
                                            @click="lang = language.code">
                                            {{ language.flag }}
                                            {{ language.name }}
                                            <DropdownMenuShortcut v-if="lang === language.code">
                                                <LucideCheck :size="15" />
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator v-if="user" />
                        <DropdownMenuItem class="text-red-500" v-if="user" @click="logOutDialogIsOpen = true">
                            <LucideLogOut :size="15" />
                            <span>Chiqish</span>
                            <DropdownMenuShortcut>
                                <LucideChevronRight :size="15" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <!-- LogOut dialog -->
                <Dialog v-model:open="logOutDialogIsOpen">
                    <DialogContent class="w-[calc(100%-1rem)] md:w-full rounded-md">
                        <DialogHeader>
                            <DialogTitle>Tizimdan chiqish</DialogTitle>
                            <DialogDescription>Tizimdan chiqishdan oldin barcha ma'lumotlaringizni saqlab qo'yinh.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter class="flex-row justify-end gap-2">
                            <DialogClose>
                                <Button>Bekor qilish</Button>
                            </DialogClose>
                            <DialogClose>
                                <Button @click="logout" variant="destructive">Chiqish</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <!-- Shortcuts -->
                <CommandDialog v-model:open="shortcutsIsOpen">
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <CommandInput />
                    <CommandList>
                        <CommandEmpty as-child>
                            <Empty />
                        </CommandEmpty>
                        <CommandGroup heading="Umumiy">
                            <CommandItem value="general_search">
                                <LucideCommand />
                                <span>Umumiy qidirish</span>
                                <CommandShortcut>
                                    <CodeSpan value="Escape" />
                                </CommandShortcut>
                            </CommandItem>
                            <CommandItem value="general_search">
                                <LucideCommand />
                                <span>Hisobga o'tish</span>
                                <CommandShortcut class="flex items-center gap-1">
                                    <CodeSpan value="Ctrl" />
                                    <span>+</span>
                                    <CodeSpan value="P" />
                                </CommandShortcut>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </div>
        </header>
        <main class="flex h-[calc(100%-3.1rem)] w-full">
            <div class="w-14 h-full border-r flex flex-col gap-2 py-3">
                <div id="home" class="w-full flex items-center justify-center">
                    <NuxtLink :to="{ name: 'home' }" v-tippy="'Bosh sahifa'"
                        class="p-2 rounded-md hover:bg-accent/30 hover:border"
                        :class="$route.name?.toString().includes('home') ? 'bg-accent/30 border' : ''">
                        <LucideHome :size="20" />
                    </NuxtLink>
                </div>
                <div id="problems" class="w-full flex items-center justify-center">
                    <NuxtLink :to="{ name: 'problems' }" v-tippy="t('problems')"
                        class="p-2 rounded-md hover:bg-accent/30 hover:border"
                        :class="$route.name?.toString().includes('problems') ? 'bg-accent/30 border' : ''">
                        <LucideLayers :size="20" />
                    </NuxtLink>
                </div>
                <div id="users" class="w-full flex items-center justify-center">
                    <NuxtLink :to="{ name: 'users' }" v-tippy="'Foydalanuvchilar'"
                        class="p-2 rounded-md hover:bg-accent/30 hover:border"
                        :class="$route.name?.toString().includes('users') ? 'bg-accent/30 border' : ''">
                        <LucideUsers :size="20" />
                    </NuxtLink>
                </div>
            </div>
            <div class="w-full h-full flex">
                <div class="flex-1 grid">
                    <ResizablePanelGroup :direction="direction">
                        <ResizablePanel :default-size="70" class="flex flex-col gap-5">
                            <div class="w-full h-full bg-accent/30 flex flex-col items-center justify-center"
                                v-if="!editorIsLoaded">
                                <LucideCode class="animate-bounce" :size="20" />
                                <p>Yuklanmoqda...</p>
                            </div>
                            <MonacoEditor v-model="code" @load="editorIsLoaded = true"
                                :options="{ theme: theme === 'dark' ? 'algo-dark' : 'vs-light' }"
                                :lang="selectedLanguage ? selectedLanguage : 'plaintext'" class="h-full w-full" />
                        </ResizablePanel>
                        <ResizableHandle with-handle class="focus:border-blue-500" />
                        <ResizablePanel :default-size="30">

                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
                <div class="w-14 border-l flex flex-col gap-2 items-center p-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div class="p-1 rounded-md hover:bg-accent cursor-pointer">
                                <Icon class="w-6 h-6" v-if="selectedLanguage"
                                    :name="languages.filter((lang) => lang.short === selectedLanguage)[0].icon" />
                                <LucideFileText :size="20" v-else />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent class="mr-2 w-56">
                            <DropdownMenuRadioGroup v-model="selectedLanguage">
                                <DropdownMenuLabel>Language</DropdownMenuLabel>
                                <DropdownMenuRadioItem v-for="language in languages" :value="language.short">
                                    <Icon class="w-6 h-6" :name="language.icon" />
                                    <span>{{ language.name }}</span>
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div class="p-1.5 rounded-md hover:bg-accent">
                        <LucidePlay class="fill-green-500 stroke-green-500" :size="20" />
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
