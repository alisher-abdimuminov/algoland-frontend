<script setup lang="ts">
import { toast } from 'vue-sonner';
import NumberFlow from "@number-flow/vue";
import { type ILanguage } from "~/types/problem";
import { LucideBadgeCheck, LucideCheck, LucideChevronLeft, LucideChevronRight, LucideClock, LucideCode, LucideCommand, LucideCpu, LucideFileText, LucideFlaskConical, LucideHome, LucideLayers, LucideLayers2, LucideListRestart, LucideLogIn, LucideLogOut, LucideLogs, LucideMessageCircle, LucideMoon, LucidePalette, LucidePlay, LucideScrollText, LucideSearch, LucideSun, LucideTimer, LucideUser, LucideUserPen, LucideUserPlus, LucideUsers, LucideX } from 'lucide-vue-next';


const { $device } = useNuxtApp();

const ws = useWs();
const { theme } = useTheme();
const { user,logout } = useAuth();
const { lang, langInfo, t } = useLang();

const problemStore = useProblemStore();
const problemsStore = useProblemsStore();
const translationsStore = useTranslationsStore();

const { problem } = storeToRefs(problemStore);
const { problems } = storeToRefs(problemsStore);

const code = ref("");
const attempts = ref<any[]>([]);
const ncase = ref<any>();
const editorIsLoaded = ref(false);
const shortcutsIsOpen = ref(false);
const logOutDialogIsOpen = ref(false);
const selectedLanguage = ref<ILanguage | undefined>(undefined);
const selectedLanguageModel = ref<string | undefined>("plaintext");


const checkAttempt = () => {
    console.log(problem.value)
    console.log(selectedLanguage)
    console.log(code)
    if (problem.value) {
        if (!selectedLanguage.value) {
            toast("Ogohlantirish", {
                description: "Tilni tanlang",
            });
        } else {
            ws.sendMessage({
                type: "attempt",
                data: {
                    problem: problem.value.uuid,
                    language: selectedLanguage.value.uuid,
                    code: code.value
                }
            })
        }
    }
}


useSeoMeta({
    titleTemplate: `${problem.value?.title} - %s`,
});


onMounted(() => {
    ws.onMessage((message) => {
        if (message.type === "attempt_case") {
            attempts.value.unshift(message.data);
            ncase.value = message.data;
        }
    })
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
            <div class="flex items-center gap-1">
                <Button size="icon" variant="outline" v-tippy="'Oldingi'"><LucideChevronLeft :size="16" /> </Button>
                <Sheet>
                    <SheetTrigger as-child>
                        <Button size="icon" variant="outline" v-tippy="'Masalalar'"><LucideLayers :size="16" /> </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Masalalar</SheetTitle>
                            <SheetDescription>Click load</SheetDescription>
                        </SheetHeader>
                        <div class="flex flex-col gap-2 py-2">    
                            <div class="flex flex-col gap-1">
                                <NuxtLink :to="{ name: 'problems-uuid', params: { uuid: iproblem.uuid } }" :class="{ 'bg-accent': problem?.uuid === iproblem.uuid }" class="w-full hover:bg-accent rounded-md p-2 flex items-center gap-1" v-for="iproblem in problems">
                                    <div v-if="problem?.uuid === iproblem.uuid" class="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span>{{ iproblem.title }}</span>
                                </NuxtLink>
                            </div>
                            <div>
                                <Button @click="problemsStore.get()">Load</Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
                <Button size="icon" variant="outline" v-tippy="'Keyingi'"><LucideChevronRight :size="16" /> </Button>
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
                                <img :src="`/api/v1/avatar/${user.username}`" class="w-4 h-4 rounded-full" alt="alisher" />
                                <span class="truncate">{{ user.full_name }}</span>
                                <DropdownMenuShortcut v-if="user.is_premium">
                                    <LucideBadgeCheck :size="15" />
                                </DropdownMenuShortcut>
                                <DropdownMenuShortcut v-else>
                                    <LucideChevronRight :size="15" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="user" @click="$router.push({ name: 'profile-edit' })">
                                <LucideUserPen />
                                <span>Tahrirlash</span>
                                <DropdownMenuShortcut>
                                    <LucideChevronRight :size="15" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="user" @click="$router.push({ name: 'profile-sessions' })">
                                <LucideListRestart :size="15" />
                                <span>Tizimga kirishlar</span>
                                <DropdownMenuShortcut>
                                    <LucideChevronRight :size="15" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="!user" @click="$router.push({ name: 'auth-login', query: { next: $route.path } })">
                                <LucideLogIn :size="15" />
                                <span>Kirish</span>
                                <DropdownMenuShortcut>
                                    <LucideChevronRight :size="15" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="!user" @click="$router.push({ name: 'auth-signup', query: { next: $route.path } })">
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
                                        <DropdownMenuItem v-for="language in translationsStore.langs" @click="lang = language.code">
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
                            <DialogDescription>Tizimdan chiqishdan oldin barcha ma'lumotlaringizni saqlab qo'yinh.</DialogDescription>
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
                    <NuxtLink :to="{ name: 'home' }" v-tippy="'Bosh sahifa'" class="p-2 rounded-md hover:bg-accent/30 hover:border" :class="$route.name?.toString().includes('home') ? 'bg-accent/30 border' : ''">
                        <LucideHome :size="20" />
                    </NuxtLink>
                </div>
                <div id="problems" class="w-full flex items-center justify-center">
                    <NuxtLink :to="{ name: 'problems' }" v-tippy="t('problems')" class="p-2 rounded-md hover:bg-accent/30 hover:border" :class="$route.name?.toString().includes('problems') ? 'bg-accent/30 border' : ''">
                        <LucideLayers :size="20" />
                    </NuxtLink>
                </div>
                <div id="users" class="w-full flex items-center justify-center">
                    <NuxtLink :to="{ name: 'users' }" v-tippy="'Foydalanuvchilar'" class="p-2 rounded-md hover:bg-accent/30 hover:border" :class="$route.name?.toString().includes('users') ? 'bg-accent/30 border' : ''">
                        <LucideUsers :size="20" />
                    </NuxtLink>
                </div>
            </div>
            <div class="w-[calc(100%-3.5rem)] h-[calc(100%-3.1)]">
                <ResizablePanelGroup :direction="$device === 'desktop' ? 'horizontal' : 'vertical'" class="w-full">
                    <ResizablePanel :default-size="50" :min-size="30" class="w-full">
                        <div class="w-full h-full flex flex-col">
                            <div class="w-full border-b pt-2 flex gap-2 px-3 overflow-auto" style="scrollbar-width: none;">
                                <NuxtLink 
                                    :to="{ name: 'problems-uuid', params: { uuid: problem?.uuid } }" 
                                    class="flex gap-1 items-center px-2 py-1"
                                    :class="$route.name === 'problems-uuid' ? 'border-b-2 border-foreground' : 'text-muted-foreground'"
                                >
                                    <LucideFileText :size="15" />
                                    <span>{{ t("description") }}</span>
                                </NuxtLink>
                                <NuxtLink 
                                    :to="{ name: 'problems-uuid-editorial', params: { uuid: problem?.uuid } }" 
                                    class="flex gap-1 items-center px-2 py-1"
                                    :class="$route.name === 'problems-uuid-editorial' ? 'border-b-2 border-foreground' : 'text-muted-foreground'"
                                >
                                    <LucideScrollText :size="15" />
                                    <span>{{ t("editorial") }}</span>
                                </NuxtLink>
                                <NuxtLink 
                                    :to="{ name: 'problems-uuid-attempts', params: { uuid: problem?.uuid } }"
                                    class="flex gap-1 items-center px-2 py-2"
                                    :class="$route.name === 'problems-uuid-attempts' ? 'border-b-2 border-foreground' : 'text-muted-foreground'"
                                >
                                    <LucideLogs :size="15" />
                                    <span class="text-sm">{{ t("attempts") }}</span>
                                </NuxtLink>
                                <NuxtLink 
                                    :to="{ name: 'problems-uuid-edit', params: { uuid: problem?.uuid } }"
                                    class="flex gap-1 items-center px-2 py-2"
                                    :class="$route.name === 'problems-uuid-edit' ? 'border-b-2 border-foreground' : 'text-muted-foreground'"
                                >
                                    <LucideMessageCircle :size="15" />
                                    <span class="text-sm">{{ t("comments") }}</span>
                                </NuxtLink>
                            </div>
                            <ScrollArea class="w-full h-full">
                                <slot />
                            </ScrollArea>
                            <div class="border-t p-3 flex gap-2">
                                <Select v-model="selectedLanguageModel" @update:model-value="(value) => selectedLanguage = problem?.languages.filter((lang) => lang.uuid === value)[0]">
                                    <SelectTrigger class="w-full">
                                        <SelectValue :placeholder="t('selectLang')" />
                                    </SelectTrigger>
                                    <SelectContent class="w-full">
                                        <SelectItem v-if="problem" v-for="language in problem.languages" :value="language.uuid" class="min-w-full">
                                            <div class="flex items-center justify-between gap-2">
                                                <Icon :name="language.icon" class="w-4 h-4" />
                                                <span>{{ language.name }}</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button>{{ t("run") }}</Button>
                                <Button v-if="user && problem" @click="checkAttempt">{{ t("send") }}</Button>
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle with-handle />
                    <ResizablePanel :default-size="50" :collapsible="true">
                        <ResizablePanelGroup direction="vertical">
                            <ResizablePanel :default-size="50">
                                <div class="w-full h-full bg-accent/30 flex flex-col items-center justify-center" v-if="!editorIsLoaded">
                                    <LucideCode class="animate-bounce" :size="20" />
                                    <p>Yuklanmoqda...</p>
                                </div>
                                <MonacoEditor v-model="code" @load="editorIsLoaded = true" :options="{ theme: theme === 'dark' ? 'algo-dark' : 'vs-light' }" :lang="selectedLanguage ? selectedLanguage.short : 'plaintext'" style="height: 100%;" />
                            </ResizablePanel>
                            <ResizableHandle with-handle />
                            <ResizablePanel :default-size="50">
                                <div class="flex h-full">
                                    <div class="flex-1 flex flex-col gap-2 w-full">
                                        <ScrollArea class="h-full p-3">
                                            {{ ncase }}
                                            <NumberFlow v-if="ncase" :value="ncase.test" />
                                            <!-- <Accordion type="single" collapsible class="w-full space-y-2">
                                                <AccordionItem v-for="attempt in attempts" :value="attempt.test.toString()" class="px-4 py-2 rounded-md border last:border-b">
                                                    <AccordionTrigger class="py-2 hover:no-underline gap-2">
                                                        <div class="flex-1 text-start">
                                                            <span class="border rounded-md px-1 py-px" :class="{
                                                                'border-green-500 bg-green-500/10 text-green-500': attempt.status === 'ac',
                                                                'border-red-500 bg-red-500/10 text-red-500': attempt.status !== 'ac',
                                                            }">
                                                                {{ attempt.status === 'wa' ? `WrongAnswer(${attempt.test})` : 'Accepted' }}
                                                            </span>
                                                        </div>
                                                        <div class="flex gap-2">
                                                            <div class="flex items-center gap-1 text-green-500">
                                                                <LucideTimer :size="15" />
                                                                <span>{{ attempt.time }}ms</span>
                                                            </div>
                                                            <div class="flex items-center gap-1 text-blue-500">
                                                                <LucideCpu :size="15" />
                                                                <span>{{ attempt.memory }}MB</span>
                                                            </div>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent class="flex flex-col gap-2">
                                                        <div class="border rounded-md">
                                                            <Table>
                                                                <TableBody>
                                                                    <TableRow>
                                                                        <TableCell>Test</TableCell>
                                                                        <TableCell class="border-l text-center">{{ attempt.test }}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell>Vaqt (ms)</TableCell>
                                                                        <TableCell class="border-l text-center">{{ (attempt.time.toString().padEnd(3, "0")) }}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell>Kirish</TableCell>
                                                                        <TableCell class="border-l text-center">{{ attempt.stdin }}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell>Kutilgan (ms)</TableCell>
                                                                        <TableCell class="border-l text-center">{{ attempt.expected }}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell>Chiqish</TableCell>
                                                                        <TableCell class="border-l text-center">{{ attempt.stdout }}</TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion> -->
                                            <div class="border rounded-md">
                                                <p>50</p>
                                                <LucideClock />
                                                <p>10ms</p>
                                                <LucideCpu />
                                                <p>10MB</p>
                                            </div>
                                        </ScrollArea>
                                    </div>
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </main>
    </div>
</template>
