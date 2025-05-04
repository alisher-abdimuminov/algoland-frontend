<script setup lang="ts">
import { Icon as Iconify } from "@iconify/vue";
import { LucideCheck, LucideCheckCheck, LucideChevronsLeftRightEllipsis, LucideCode, LucideCpu, LucideExternalLink, LucideLink, LucidePlus, LucideTimer, LucideTrash, LucideWrapText } from 'lucide-vue-next';
import { ListboxContent, ListboxItem, ListboxRoot } from 'reka-ui';



const { user } = useAuth();
const { theme } = useTheme();

const problemStore = useProblemStore();
const tagsStore = useProblemTagsStore();
const { langs } = useTranslationsStore();
const languagesStore = useLanguagesStore();

const { tags } = storeToRefs(tagsStore);
const { problem } = storeToRefs(problemStore);
const { languages } = storeToRefs(languagesStore);


const isWaiting = ref(false);
const tagsAllSelected = ref(false);
const languagesAllSelected = ref(false);
const selectedTags = ref<string[]>([]);
const selectedLanguages = ref<string[]>([]);
const frozenOptions = computed(() => {
    return {
        acceptSuggestionOnCommitCharacter: false,
        minimap: {
            enabled: false
        },
        theme: theme.value === 'dark' ? 'vs-dark' : 'vs-light',
        quickSuggestions: false,
        suggest: {
            filterGraceful: false,
            matchOnWordStartOnly: false,
            preview: false,
            showClasses: false,
            showColors: false,
            showConstants: false,
            showConstructors: false,
            showDeprecated: false,
            showEnumMembers: false,
            showEnums: false,
            showEvents: false,
            showFields: false,
            showFiles: false,
            showFolders: false,
            showFunctions: false,
            showIcons: false,
            showInlineDetails: false,
            showInterfaces: false,
            showIssues: false,
            showKeywords: false,
            showMethods: false,
            showModules: false,
            showOperators: false,
            showProperties: false,
            showReferences: false,
            showSnippets: false,
            showStatusBar: false,
            showStructs: false,
            showTypeParameters: false,
            showUnits: false,
            showUsers: false,
            showValues: false,
            showVariables: false,
            showWords: false,
            snippetsPreventQuickSuggestions: false
        }
    }
});


const editProblem = async () => {
    const data = {
        "title": problem.value?.title,
        "description": problem.value?.description,
        "hint": problem.value?.hint,
        "input": problem.value?.input,
        "output": problem.value?.output,
        "samples": problem.value?.samples,
        "language": problem.value?.language,
        "difficulty": problem.value?.difficulty,
        "time_limit": problem.value?.time_limit,
        "memory_limit": problem.value?.memory_limit,
        "with_link": problem.value?.with_link,
        "languages": selectedLanguages.value,
        "tags": selectedTags.value,
    }
    let response = await $fetch(api(`problems/problem/${problem.value?.uuid}/edit`), {
        method: "POST",
        body: JSON.stringify({
            "data": encode(JSON.stringify(data))
        }),
        headers: {
            ...(user.value ? { Authorization: `Token ${user.value?.token}` } : {})
        }
    });
    console.log(response);
}

const selectAllLanguages = (value: boolean) => {
    if (value) {
        languages.value.forEach((lang) => {
            selectedLanguages.value.push(lang.id);
        });
    } else {
        selectedLanguages.value = [];
    }
}

const selectAllTags = (value: boolean) => {
    if (value) {
        tags.value.forEach((tag) => {
            selectedTags.value.push(tag.id);
        });
    } else {
        selectedTags.value = [];
    }
}


definePageMeta({
    layout: "default",
    middleware: ["problem-is-exists", "get-languages", "check-role", "get-problem-tags",],
    type: "edit",
    object: "problem",
});


onMounted(() => {
    if (problem.value) {
        // init selected langs
        problem.value.languages.forEach((lang) => {
            selectedLanguages.value.push(lang.id);
        });
        if (selectedLanguages.value.length === languages.value.length) {
            languagesAllSelected.value = true;
        }

        // init selected tags
        problem.value.tags.forEach((tag) => {
            selectedTags.value.push(tag.id);
            console.log(tag);
        });
        console.log(selectedTags.value)
        if (selectedTags.value.length === tags.value.length) {
            tagsAllSelected.value = true;
        }
    }
});
</script>

<template>
    <Auth :is-auth="true" class="mb-10">
        <div class="p-5 md:p-10 flex flex-col gap-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink as-child>
                            <NuxtLink to="/home">Bosh sahifa</NuxtLink>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink as-child>
                            <NuxtLink :to="{ name: 'problems' }">Masalalar</NuxtLink>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink as-child>
                            <NuxtLink :to="{ name: 'problems-uuid', params: { uuid: problem?.uuid } }">{{ problem?.title
                                }}</NuxtLink>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            Tahrirlash
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div class="flex flex-col gap-5" v-if="problem">
                <div class="border rounded-md bg-accent/30 divide-y">
                    <div class="p-3 flex flex-col gap-2">
                        <p class="text-xl">Sarlavha <span class="text-red-500">*</span></p>

                        <div class="relative">
                            <Input :disabled="isWaiting" v-model="problem.title" :maxlength="32" />
                            <div class="absolute top-0 right-0 w-10 h-full flex items-center justify-center">
                                <p class="text-xs text-muted-foreground">{{ 32 - problem.title.length }}</p>
                            </div>
                        </div>
                        <p class="text-xs"></p>
                    </div>
                    <div class="p-3">
                        <ul class="list-disc pl-2">
                            <li class="text-xs text-muted-foreground">Masala nomi</li>
                            <li class="text-xs text-muted-foreground">Ko'pi bilan 32 ta belgi ishlating.</li>
                        </ul>
                    </div>
                </div>

                <div class="border rounded-md bg-accent/30 divide-y">
                    <div class="p-3 flex flex-col gap-2">
                        <p class="text-xl">Til <span class="text-red-500">*</span></p>
                        <Select v-model="problem.language">
                            <SelectTrigger>
                                <SelectValue placeholder="Tilni tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="lang in langs" :value="lang.code">{{ lang.flag }} {{ lang.name }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="p-3">
                        <ul class="list-disc pl-2">
                            <li class="text-xs text-muted-foreground">Masala matninig asosiy tili</li>
                        </ul>
                    </div>
                </div>

                <div class="border rounded-md bg-accent/30 divide-y">
                    <div class="p-3 flex flex-col gap-2">
                        <p class="text-xl">Qiyinchiligi <span class="text-red-500">*</span></p>
                        <Select v-model="problem.difficulty">
                            <SelectTrigger>
                                <SelectValue placeholder="Qiyinchiligini tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="p-3">
                        <ul class="list-disc pl-2">
                            <li class="text-xs text-muted-foreground">Masala matninig asosiy tili</li>
                        </ul>
                    </div>
                </div>

                <p class="text-xl">Sharti</p>
                <Collapsible v-for="(description, index) in langs" class="border rounded-md bg-accent/30 divide-y">
                    <CollapsibleTrigger class="p-3 w-full text-start">
                        <p class="text-xl">{{langs.filter((lang) => lang.code === description.code)[0].flag}} {{
                            langs.filter((lang) => lang.code === description.code)[0].name }}</p>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div>
                            <MonacoEditor v-model:model-value="problem.description[description.code]" class="h-96"
                                :options="frozenOptions" lang="markdown" />
                        </div>
                        <div class="p-3 border-t">
                            <ul class="list-disc pl-2">
                                <li class="text-xs text-muted-foreground">Masala matni - Ingliz tilida</li>
                                <li class="text-xs text-muted-foreground">Markdown formati qo'llab-quvvatlanadi. <a
                                        href="#" class="inline-flex gap-1 underline">Ko'proq o'qing
                                        <LucideExternalLink :size="15" />
                                    </a>.</li>
                            </ul>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                <p class="text-xl">Maslahatlar</p>
                <Collapsible v-for="(hint, index) in langs" class="border rounded-md bg-accent/30 divide-y">
                    <CollapsibleTrigger class="p-3 w-full text-start">
                        <p class="text-xl">{{langs.filter((lang) => lang.code === hint.code)[0].flag}} {{
                            langs.filter((lang) => lang.code === hint.code)[0].name }}</p>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div>
                            <MonacoEditor v-model:model-value="problem.hint[hint.code]" class="h-96 z-0"
                                :options="frozenOptions" lang="markdown" />
                        </div>
                        <div class="p-3 border-t">
                            <ul class="list-disc pl-2">
                                <li class="text-xs text-muted-foreground">Masala matni - Ingliz tilida</li>
                                <li class="text-xs text-muted-foreground">Markdown formati qo'llab-quvvatlanadi. <a
                                        href="#" class="inline-flex gap-1 underline">Ko'proq o'qing
                                        <LucideExternalLink :size="15" />
                                    </a>.</li>
                            </ul>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                <p class="text-xl">Kirish oqimi</p>
                <Collapsible v-for="(input, index) in langs" class="border rounded-md bg-accent/30 divide-y">
                    <CollapsibleTrigger class="p-3 w-full text-start">
                        <p class="text-xl">{{langs.filter((lang) => lang.code === input.code)[0].flag}} {{
                            langs.filter((lang) => lang.code === input.code)[0].name }}</p>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div>
                            <MonacoEditor v-model:model-value="problem.input[input.code]" class="h-96"
                                :options="frozenOptions" lang="markdown" />
                        </div>
                        <div class="p-3 border-t">
                            <ul class="list-disc pl-2">
                                <li class="text-xs text-muted-foreground">Masala matni - Ingliz tilida</li>
                                <li class="text-xs text-muted-foreground">Markdown formati qo'llab-quvvatlanadi. <a
                                        href="#" class="inline-flex gap-1 underline">Ko'proq o'qing
                                        <LucideExternalLink :size="15" />
                                    </a>.</li>
                            </ul>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                <p class="text-xl">Chiqish oqimi</p>
                <Collapsible v-for="(output, index) in langs" class="border rounded-md bg-accent/30 divide-y">
                    <CollapsibleTrigger class="p-3 w-full text-start">
                        <p class="text-xl">{{langs.filter((lang) => lang.code === output.code)[0].flag}} {{
                            langs.filter((lang) => lang.code === output.code)[0].name }}</p>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div>
                            <MonacoEditor v-model:model-value="problem.output[output.code]" class="h-96"
                                :options="frozenOptions" lang="markdown" />
                        </div>
                        <div class="p-3 border-t">
                            <ul class="list-disc pl-2">
                                <li class="text-xs text-muted-foreground">Masala matni - Ingliz tilida</li>
                                <li class="text-xs text-muted-foreground">Markdown formati qo'llab-quvvatlanadi. <a
                                        href="#" class="inline-flex gap-1 underline">Ko'proq o'qing
                                        <LucideExternalLink :size="15" />
                                    </a>.</li>
                            </ul>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                <div class="border rounded-md bg-accent/30 divide-y">
                    <div class="p-3 flex flex-col gap-2">
                        <p class="text-xl">Misollar</p>
                        <div class="flex items-center justify-end">
                            <Button :disabled="problem.samples.length === 10" size="sm"
                                @click="problem.samples.push({ id: randomID(), input: 'kirish', output: 'chiqish' })">
                                <LucidePlus /> Qo'shish
                            </Button>
                        </div>
                        <div class="border rounded-md overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead class="w-4">#</TableHead>
                                        <TableHead class="border-l">Kirish</TableHead>
                                        <TableHead class="border-l">Chiqish</TableHead>
                                        <TableHead class="border-l w-10">O'chirish</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="(sample, index) in problem.samples">
                                        <TableCell>{{ index + 1 }}</TableCell>
                                        <TableCell class="border-l p-0">
                                            <textarea class="w-full h-24 p-2 bg-transparent resize-none outline-none"
                                                v-model="sample.input"></textarea>
                                        </TableCell>
                                        <TableCell class="border-l p-0">
                                            <textarea class="w-full h-24 p-2 bg-transparent resize-none outline-none"
                                                v-model="sample.output"></textarea>
                                        </TableCell>
                                        <TableCell class="border-l text-center">
                                            <Button
                                                @click="problem.samples = problem.samples.filter((value) => value.id !== sample.id)"
                                                size="icon" variant="destructive">
                                                <LucideTrash :size="15" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <div class="p-3">
                        <ul class="list-disc pl-2">
                            <li class="text-xs text-muted-foreground">Masala sinovlariga misollar</li>
                            <li class="text-xs text-muted-foreground">Markdown formati qo'llab-quvvatlanadi. <a href="#"
                                    class="inline-flex gap-1 underline">Ko'proq o'qing
                                    <LucideExternalLink :size="15" />
                                </a>.</li>
                        </ul>
                    </div>
                </div>

                <div class="border rounded-md bg-accent/30 divide-y">
                    <div class="p-3 flex items-center justify-between">
                        <p class="text-xl">Dasturlash tillari</p>
                        <Toggle v-tippy="'Barchasini tanlash'" v-model:model-value="languagesAllSelected"
                            @update:model-value="(value) => value === true ? selectAllLanguages(true) : selectAllLanguages(false)">
                            <LucideCheckCheck />
                        </Toggle>
                    </div>
                    <div class="p-3 flex flex-col gap-2">
                        <ListboxRoot multiple v-model="selectedLanguages"
                            @update:model-value="(value) => { value && Object(value).length !== languages.length ? languagesAllSelected = false : languagesAllSelected = true }">
                            <ListboxContent
                                class="flex flex-col gap-1 space-y-1 overflow-auto p-1 text-sm shadow-xs transition-[color,box-shadow]">
                                <ListboxItem v-for="language in languages" :value="language.id"
                                    class="cursor-pointer group hover:bg-accent/30 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground data-[highlighted]:bg-accent/50 data-[highlighted]:text-accent-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 relative rounded px-2 py-1.5 outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-visible:ring-[3px] flex items-center justify-between">
                                    <div class="flex-1 flex items-center gap-1">
                                        <Icon :name="language.icon" class="w-6 h-6" /> {{ language.name }}
                                    </div>
                                    <div>
                                        <LucideCheck :size="15" class="hidden group-data-[state=checked]:block" />
                                    </div>
                                </ListboxItem>
                            </ListboxContent>
                        </ListboxRoot>
                    </div>
                    <div class="p-3">
                        <ul class="list-disc pl-2">
                            <li class="text-xs text-muted-foreground">Masalani yechish mumkin bo'lgan dasturlash
                                tillari.</li>
                        </ul>
                    </div>
                </div>

                <div class="border rounded-md bg-accent/30 divide-y">
                    <div class="p-3 flex items-center justify-between">
                        <p class="text-xl">Teglar</p>
                        <Toggle v-tippy="'Barchasini tanlash'" v-model:model-value="tagsAllSelected"
                            @update:model-value="(value) => value === true ? selectAllTags(true) : selectAllTags(false)">
                            <LucideCheckCheck />
                        </Toggle>
                    </div>
                    <div class="p-3 flex flex-col gap-2">
                        <ListboxRoot multiple v-model="selectedTags"
                            @update:model-value="(value) => { value && Object(value).length !== tags.length ? tagsAllSelected = false : tagsAllSelected = true }">
                            <ListboxContent
                                class="flex flex-col gap-1 space-y-1 overflow-auto p-1 text-sm shadow-xs transition-[color,box-shadow]">
                                <ListboxItem v-for="tag in tags" :value="tag.id"
                                    class="cursor-pointer group hover:bg-accent/30 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground data-[highlighted]:bg-accent/50 data-[highlighted]:text-accent-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 relative rounded px-2 py-1.5 outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-visible:ring-[3px] flex items-center justify-between">
                                    <span>{{ tag.name }}</span>
                                    <div>
                                        <LucideCheck :size="15" class="hidden group-data-[state=checked]:block" />
                                    </div>
                                </ListboxItem>
                            </ListboxContent>
                        </ListboxRoot>
                    </div>
                    <div class="p-3">
                        <ul class="list-disc pl-2">
                            <li class="text-xs text-muted-foreground">Masalani yechish mumkin bo'lgan dasturlash
                                tillari.</li>
                        </ul>
                    </div>
                </div>

                <p class="text-xl">Sozlamalar</p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="border rounded-md bg-accent/30 divide-y">
                        <div class="p-3 flex flex-col gap-2">
                            <p class="text-xl flex items-center gap-1">
                                <LucideTimer /> Vaqt cheklovi <span class="text-red-500">*</span>
                            </p>
                            <div class="flex items-center gap-1 ">
                                <NumberField v-model="problem.time_limit" class="w-full">
                                    <NumberFieldContent>
                                        <NumberFieldDecrement />
                                        <NumberFieldInput />
                                        <NumberFieldIncrement />
                                    </NumberFieldContent>
                                </NumberField>
                                <p>s</p>
                            </div>
                        </div>
                        <div class="p-3">
                            <ul class="list-disc pl-2">
                                <li class="text-xs text-muted-foreground">Masalani yechish uchun har bir test holatiga
                                    ajratilgan eng ko'p vaqt</li>
                            </ul>
                        </div>
                    </div>
                    <div class="border rounded-md bg-accent/30 divide-y">
                        <div class="p-3 flex flex-col gap-2">
                            <p class="text-xl flex items-center gap-1">
                                <LucideCpu /> Xotira cheklovi <span class="text-red-500">*</span>
                            </p>
                            <div class="flex items-center gap-2">
                                <NumberField v-model="problem.memory_limit" class="w-full">
                                    <NumberFieldContent>
                                        <NumberFieldDecrement />
                                        <NumberFieldInput />
                                        <NumberFieldIncrement />
                                    </NumberFieldContent>
                                </NumberField>
                                <p>MB</p>
                            </div>
                        </div>
                        <div class="p-3">
                            <ul class="list-disc pl-2">
                                <li class="text-xs text-muted-foreground">Masalani yechimining ishlatilish jarayonida
                                    ishlata oladigan eng ko'p xotira miqdori.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="border rounded-md bg-accent/30 divide-y">
                        <div class="p-3 flex flex-col gap-2">
                            <p class="text-xl flex items-center gap-1">
                                <LucideLink /> Havola orqali
                            </p>
                            <div class="flex items-center gap-2">
                                <Switch v-model:model-value="problem.with_link" />
                            </div>
                        </div>
                        <div class="p-3">
                            <ul class="list-disc pl-2">
                                <li class="text-xs text-muted-foreground">Agar masalangiz hali ommaviy bo'lmasa va
                                    <CodeSpan value="Havola orqali" /> yoqilgan bo'lsa u holda boshqalar havola orqali
                                    masalangizga kira olishlari mumkin.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </Auth>
    <div class="z-100 w-[calc(100%-3.5rem)] bg-background/70 backdrop-blur-sm border-t fixed bottom-0">
        <div class="flex items-center justify-end p-2 md:p-3">
            <Button :disabled="isWaiting" @click="editProblem">
                <Iconify v-if="isWaiting" icon="svg-spinners:bars-rotate-fade" /> Saqlash
            </Button>
        </div>
    </div>
</template>