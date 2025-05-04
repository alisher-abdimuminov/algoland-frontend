<script setup lang="ts">
import { LucideBadgeCheck, LucideBell, LucideBellDot, LucideCheck, LucideCheckCheck, LucideChevronRight, LucideCommand, LucideHome, LucideLayers, LucideLayers2, LucideListRestart, LucideLogIn, LucideLogOut, LucideMoon, LucideStickyNote, LucideSun, LucideUser, LucideUserPen, LucideUserPlus, LucideUsers } from 'lucide-vue-next';
import type { WSNotification } from '~/types/codes';


const ws = useWs();
const { theme } = useTheme();
const { user, logout } = useAuth();
const { lang, t, langInfo } = useLang();

const notificationsStore = useNotificationsStore();

const translationsStore = useTranslationsStore();
const { notifications } = storeToRefs(notificationsStore);

const shortcutsIsOpen = ref(false);
const logOutDialogIsOpen = ref(false);


const readNotifications = (notifications: WSNotification[]) => {
    if (ws) {
        ws.sendMessage({
            type: "read_notifications",
            data: null
        });
        notificationsStore.read();
    }
}


useSeoMeta({
    titleTemplate: "AlgoLand - %s"
});

onMounted(() => {

});

</script>

<template>
    <div class="h-screen w-full">
        <header class="h-[3rem] w-full border-b flex items-center justify-between px-4">
            <div class="flex items-center gap-1">
                <Logo class="w-6 h-6" />
                <p class="font-bold">algoland</p>
            </div>
            <div></div>
            <div class="flex items-center gap-1">
                <Popover>
                    <PopoverTrigger as-child>
                        <div class="relative p-2 rounded-md hover:bg-accent cursor-pointer" v-tippy="'Notifications'">
                            <LucideBell :size="16" />
                            <div
                                v-if="notifications.filter((notification) => notification.is_readed === false && notification.type !== 'all').length > 0"
                                class="absolute top-0 right-0 bg-red-500 rounded-full text-xs min-w-4 min-h-4 flex items-center justify-center">
                                {{ notifications.filter((notification) => notification.is_readed === false && notification.type !== "all").length }}
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent class="h-full w-80 mr-2 p-0">
                        <div class="px-3 pt-3 flex items-center justify-between">
                            <p class="font-bold text-lg">Notifications</p>
                        </div>
                        <ScrollArea class="max-h-96">
                            <div class="grid gap-2 p-3">
                                <div v-for="notification in notifications" class="cursor-pointer hover:bg-accent/50 rounded-md p-2">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center justify-center gap-1">
                                            <div class="relative" v-if="notification.type !== 'all' && !notification.is_readed">
                                                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                                                <div
                                                    class="absolute top-0 left-0 animate-ping size-2 rounded-full bg-green-500">
                                                </div>
                                            </div>
                                            <LucideCheckCheck :size="15" v-else-if="notification.is_readed" class="text-green-500" />
                                            <LucideBellDot :size="15" v-else />
                                            <span>{{ notification.title }}</span>
                                        </div>
                                        <span class="text-xs text-muted-foreground">{{ formatDateTime(notification.created,
                                            true) }}</span>
                                    </div>
                                    <div class="text-sm">
                                        {{ notification.content }}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                        <div class="flex items-center justify-between px-3 pb-3">
                            <Button @click="readNotifications" size="xs" class="text-xs">Barchasini o'qish</Button>
                            <Button size="xs" class="text-xs">Barchasi</Button>
                        </div>
                    </PopoverContent>
                </Popover>
                <DropdownMenu>
                    <DropdownMenuTrigger v-tippy="'Ro\'yxatni ochish'" as-child>
                        <Button size="icon" variant="ghost" class="w-8 h-8">
                            <LucideUser :size="16" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-64 mr-2">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Hisob</DropdownMenuLabel>
                            <DropdownMenuItem v-if="user">
                                <img :src="`/api/v1/avatar/${user.username}`" class="w-4 h-4 rounded-full"
                                    alt="alisher" />
                                <span class="truncate">{{ user.first_name }} {{ user.last_name }}</span>
                                <DropdownMenuShortcut v-if="user.is_premium">
                                    <LucideBadgeCheck :size="15" />
                                </DropdownMenuShortcut>
                                <DropdownMenuShortcut v-else>
                                    <LucideChevronRight :size="15" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="user" @click="$router.push({ name: 'profile-edit' })">
                                <LucideUserPen :size="16" />
                                <span>Tahrirlash</span>
                                <DropdownMenuShortcut>
                                    <LucideChevronRight :size="15" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="user" @click="$router.push({ name: 'profile-sessions' })">
                                <LucideListRestart :size="16" />
                                <span>Tizimga kirishlar</span>
                                <DropdownMenuShortcut>
                                    <LucideChevronRight :size="15" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="!user"
                                @click="$router.push({ name: 'auth-login', query: { next: $route.path } })">
                                <LucideLogIn :size="15" />
                                <span>{{ t("login") }}</span>
                                <DropdownMenuShortcut>
                                    <LucideChevronRight :size="15" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="!user"
                                @click="$router.push({ name: 'auth-signup', query: { next: $route.path } })">
                                <LucideUserPlus :size="15" />
                                <span>{{ t("signup") }}</span>
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
                                    {{ t("dark") }}
                                    <DropdownMenuShortcut>
                                        <LucideMoon :size="15" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="light">
                                    {{ t("light") }}
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
                <Dialog v-model:open="logOutDialogIsOpen">
                    <DialogContent class="w-[calc(100%-1rem)] md:w-full rounded-md">
                        <DialogHeader>
                            <DialogTitle>{{ t("logout") }}</DialogTitle>
                            <DialogDescription>Tizimdan chiqishdan oldin barcha ma'lumotlaringizni saqlab qo'yinh.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter class="flex-row justify-end gap-2">
                            <DialogClose>
                                <Button>Bekor qilish</Button>
                            </DialogClose>
                            <DialogClose>
                                <Button @click="logout" variant="destructive">{{ t("logout") }}</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
        <main class="flex h-[calc(100%-3.1rem)]">
            <div class="w-14 h-full border-r flex flex-col gap-2 py-3">
                <div id="home" class="w-full flex items-center justify-center">
                    <NuxtLink :to="{ name: 'home' }" v-tippy="'Bosh sahifa'"
                        class="p-2 rounded-md border hover:bg-accent/30 hover:border"
                        :class="$route.name?.toString().includes('home') ? 'bg-accent/30 border' : 'border-transparent'">
                        <LucideHome :size="20" />
                    </NuxtLink>
                </div>
                <div id="problems" class="w-full flex items-center justify-center">
                    <NuxtLink :to="{ name: 'problems' }" v-tippy="'Masalalar'"
                        class="p-2 rounded-md border hover:bg-accent/30 hover:border"
                        :class="$route.name?.toString().includes('problems') ? 'bg-accent/30 border' : 'border-transparent'">
                        <LucideLayers :size="20" />
                    </NuxtLink>
                </div>
                <div id="users" class="w-full flex items-center justify-center">
                    <NuxtLink :to="{ name: 'users' }" v-tippy="'Foydalanuvchilar'"
                        class="p-2 rounded-md border hover:bg-accent/30 hover:border"
                        :class="$route.name?.toString().includes('users') ? 'bg-accent/30 border' : 'border-transparent'">
                        <LucideUsers :size="20" />
                    </NuxtLink>
                </div>
                <div id="posts" class="w-full flex items-center justify-center">
                    <NuxtLink :to="{ name: 'posts' }" v-tippy="'Maqolalar'"
                        class="p-2 rounded-md border hover:bg-accent/30 hover:border"
                        :class="$route.name?.toString().includes('posts') ? 'bg-accent/30 border' : 'border-transparent'">
                        <LucideStickyNote :size="20" />
                    </NuxtLink>
                </div>
            </div>
            <ScrollArea class="flex-1 h-full">
                <slot />
            </ScrollArea>
        </main>
    </div>
</template>