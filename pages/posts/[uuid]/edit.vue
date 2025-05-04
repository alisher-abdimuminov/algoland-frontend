<script setup lang="ts">
import { ListboxContent, ListboxItem, ListboxRoot } from 'reka-ui';
import { LucideCheck, LucideCheckCheck, LucideEye } from 'lucide-vue-next';
import type { Response } from '~/types';
import type { Post } from '~/types/post';
import { toast } from '~/components/ui/toast';
import mark from '~/composables/useMark';


const { user } = useAuth();
const { theme } = useTheme();

const postStore = usePostStore();
const postTagsStore = usePostTagsStore();

const { post } = storeToRefs(postStore);
const { tags } = storeToRefs(postTagsStore);


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
        },
    }
});
const isWaiting = ref(false);
const isLoading = ref(true);
const isPreview = ref(false);
const errors = ref<string[]>([]);
const tagsAllSelected = ref(false);
const selectedTags = ref<string[]>([]);


const selectAllTags = (value: boolean) => {
    if (value) {
        tags.value.forEach((tag) => {
            selectedTags.value.push(tag.id);
        });
    } else {
        selectedTags.value = [];
    }
}

const editPost = async () => {
    isWaiting.value = true;
    if (post.value && user.value) {
        const data = {
            "title": post.value.title,
            "description": post.value.description,
            "content": post.value.content,
            "tags": selectedTags.value,
        }
        let response = await $fetch<Response>(api(`posts/post/${post.value.uuid}/edit`), {
            method: "POST",
            body: JSON.stringify({
                "data": encode(JSON.stringify(data))
            }),
            headers: {
                Authorization: `Token ${user.value.token}`
            }
        });
        
        if (response.status === "error") {
            let decoded = jsonify<string[]>(decode(response.data));
            if (decoded) {
                errors.value = decoded;
            }
        } else {
            let decoded = jsonify<Post>(decode(response.data));
            if (decoded) {
                postStore.set(decoded);
            }
            toast({
                title: "Ajoyib",
                description: "Maqola tahrirlandi"
            });
        }
    }
    isWaiting.value = false;
}


definePageMeta({
    middleware: ["post-is-exists", "get-post-tags",],
});

useSeoMeta({
    title: `"${post.value?.title}" (Tahrirlash)`,
    description: post.value?.description,
    author: `${post.value?.author.first_name} ${post.value?.author.last_name}`,
    articleAuthor: [`${post.value?.author.first_name} ${post.value?.author.last_name}`],
    articlePublishedTime: formatDateTime(post.value ? post.value.created : ''),
});


onMounted(() => {
    isLoading.value = false;
    if (post.value) {
        post.value.tags.forEach((tag) => {
            selectedTags.value.push(tag.id);
        });
        if (selectedTags.value.length === tags.value.length) {
            tagsAllSelected.value = true;
        }
    }
});
</script>

<template>
    <Auth :is-auth="true" class="relative p-5 md:p-10 flex flex-col gap-5 mb-10" v-if="post">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink as-child>
                        <NuxtLink :to="{ name: 'home' }">Bosh sahifa</NuxtLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink as-child>
                        <NuxtLink :to="{ name: 'posts' }">Maqolalar</NuxtLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink as-child>
                        <NuxtLink :to="{ name: 'posts-uuid', params: { uuid: post.uuid } }">{{ post.title }}</NuxtLink>
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

        <div class="flex flex-col gap-1">
            <span :class="{ 'text-red-500': errors.includes('title') }" class="text-xs text-muted-foreground">Title</span>
            <input type="text" v-model="post.title" class="bg-transparent outline-none text-3xl font-bold">
            <span class="text-xs text-muted-foreground">{{ formatDateTime(post.created, true) }}</span>
        </div>
        <div class="flex flex-col gap-2 h-full w-full">
            <div class="flex items-center justify-between">
                <span :class="{ 'text-red-500': errors.includes('content') }" class="text-xs text-muted-foreground">Content</span>
                <Toggle v-tippy="'Preview'" v-model:model-value="isPreview"><LucideEye :size="15" /> </Toggle>
            </div>
            <ScrollArea v-show="isPreview" class="h-96 p-2 border rounded-md">
                <component v-for="node in mark(post.content)" :is="node" />
            </ScrollArea>
            <MonacoEditor v-show="!isPreview" v-model:model-value="post.content" class="h-96" :options="{ ...frozenOptions, lineNumbers: 'off' }" lang="markdown" />
        </div>
        <div class="flex flex-col gap-2">
            <span :class="{ 'text-red-500': errors.includes('description') }" class="text-xs text-muted-foreground">Description</span>
            <div class="relative">
                <Textarea maxlength="100" class="resize-none" v-model:model-value="post.description" />
                <div class="absolute bottom-0 right-0 text-xs text-muted-foreground p-1">
                    <span>{{ post.description.length }}/100</span>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
                <span class="text-xs text-muted-foreground">Tags</span>
                <Toggle v-tippy="'Barchasini tanlash'" v-model:model-value="tagsAllSelected"
                    @update:model-value="(value) => value === true ? selectAllTags(true) : selectAllTags(false)">
                    <LucideCheckCheck />
                </Toggle>
            </div>
            <ListboxRoot multiple v-model="selectedTags"
                @update:model-value="(value) => { value && Object(value).length !== tags.length ? tagsAllSelected = false : tagsAllSelected = true }">
                <ListboxContent
                    class="flex flex-col gap-1 space-y-1 overflow-auto p-1 text-sm shadow-xs transition-[color,box-shadow]">
                    <ListboxItem v-for="tag in tags" :value="tag.id"
                        class="cursor-pointer group hover:bg-accent/30 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground data-[highlighted]:bg-accent/50 data-[highlighted]:text-accent-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 relative rounded px-2 py-1.5 outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-visible:ring-[3px] flex items-center justify-between">
                        <div class="flex-1 flex items-center gap-1">
                            {{ tag.name }}
                        </div>
                        <div>
                            <LucideCheck :size="15" class="hidden group-data-[state=checked]:block" />
                        </div>
                    </ListboxItem>
                </ListboxContent>
            </ListboxRoot>
        </div>
    </Auth>
    <div class="z-100 w-[calc(100%-3.5rem)] bg-background/70 backdrop-blur-sm border-t fixed bottom-0">
        <div class="flex items-center justify-end p-2 md:p-3">
            <Button :disabled="isWaiting || isLoading" @click="editPost">
                <Loader v-if="isLoading || isWaiting" /> Saqlash
            </Button>
        </div>
    </div>
</template>