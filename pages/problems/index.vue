<script setup lang="ts">
import type { AlgoCalendarData, IPage, IResponse } from '~/types';
import type { IProblems, IProblemTag } from '~/types/problem';
import { Icon as Iconify } from '@iconify/vue/dist/iconify.js';
import { LucideBadgeCheck, LucideCircle, LucideCheck, LucideListCheck, LucidePlus, LucideSearch, LucideSettings, LucideArrowUpDown } from 'lucide-vue-next';
import type { AddProblem } from '~/types/codes';
import { toast } from '~/components/ui/toast';


const route = useRoute();
const router = useRouter();

const { user } = useAuth();

const problemTags = useProblemTagsStore();

const { tags } = storeToRefs(problemTags);


const problems = ref<IProblems[]>([]);
    const pagination = ref<IPage>({
    next: 0,
    number: 1,
    pages: 0,
    previous: 0,
    search: " "
});
const isLoading = ref(true);
const isWaiting = ref(false);
const isCreating = ref(false);
let typingTimer: NodeJS.Timeout | null = null;
const data: AlgoCalendarData[] = [
    {
        uuid: "123",
        date: "2025-04-30",
        isSolved: true,
        isFirstSolver: true,
        title: "Hello, World!",
        time: "13:05:12",
    },
    {
        uuid: "123",
        date: "2025-04-3",
        isSolved: true,
        isFirstSolver: false,
        title: "Hello, World!",
        time: "13:05:12",
    },
    {
        uuid: "123",
        date: "2025-04-14",
        isSolved: true,
        isFirstSolver: true,
        title: "Hello, World!",
        time: "13:05:12",
    },
    {
        uuid: "123",
        date: "2025-04-15",
        isSolved: true,
        isFirstSolver: false,
        title: "Hello, World!",
        time: "13:05:12",
    },
    {
        uuid: "123",
        date: "2025-04-16",
        isSolved: true,
        isFirstSolver: false,
        title: "Hello, World!",
        time: "13:05:12",
    },
    {
        uuid: "123",
        date: "2025-04-18",
        isSolved: true,
        isFirstSolver: false,
        title: "Hello, World!",
        time: "13:05:12",
    },
    {
        uuid: "123",
        date: "2025-04-12",
        isSolved: true,
        isFirstSolver: false,
        title: "Hello, World!",
        time: "13:05:12",
    },
    {
        uuid: "123",
        date: "2025-04-13",
        isSolved: true,
        isFirstSolver: false,
        title: "Hello, World!",
        time: "13:05:12",
    },
];


const onInput = (): void => {
    console.log("done");
    if (typingTimer) {
        clearTimeout(typingTimer);
    }

    typingTimer = setTimeout(() => {
        getProblems();
    }, 2000);
};


const getProblems = async (pageNumber: number = 1) => {
    isWaiting.value = true;
    let response = await $fetch<IResponse>(api("problems") + `?page=${pageNumber}&search=${pagination.value.search}`, {
        method: "GET",
        headers: {
            ...(user ? {"Authorization": `Token ${user.value?.token}`} : {})
        }
    });

    if (response.status === "error") {

    } else {
        let decoded = jsonify<{ page: IPage, problems: IProblems[] }>(decode(response.data));
        console.log(decoded);
        if (decoded) {
            pagination.value = decoded.page;
            problems.value = decoded.problems;
        }
    }
    router.push({ name: "problems", query: { page: pagination.value.number, search: pagination.value.search } });
    isWaiting.value = false;
}

const addProblem = async () => {
    isCreating.value = true;
    if (user.value) {
        let response = await $fetch<IResponse<AddProblem>>(api("problems/add"), {
            method: "POST",
            headers: {
                Authorization: `Token ${user.value.token}`
            }
        });

        if (response.status === "error") {
            console.log(response.code);
        } else {
            let decoded = jsonify<{ uuid: string }>(decode(response.data));

            if (decoded) {
                router.push({ name: "problems-uuid-edit", params: { uuid: decoded.uuid } });
            }

            if (response.code === "add_problem_001") {
                toast({
                    title: "Ajoyib",
                    description: "Masala yaratildi",
                });
            }
        }
    }
    isCreating.value = false;
}


if (route.query.page) {
    pagination.value.number = Number(route.query.page);
} else {
    pagination.value.number = 1;
}

if (route.query.search) {
    pagination.value.search = String(route.query.search);
} else {
    pagination.value.search = "";
}


definePageMeta({
    middleware: ["get-problem-tags",],
});

useSeoMeta({
    title: `Masalalar`,
});


onMounted(() => {
    getProblems();
    isLoading.value = false;
});
</script>

<template>
    <div class="p-5 md:p-10 grid gap-5">
        <div class="flex items-center justify-between">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink as-child>
                            <NuxtLink to="/home">Bosh sahifa</NuxtLink>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            Masalalar
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div v-if="user">
                <Button size="sm" @click="addProblem">
                    <Loader v-if="isWaiting" class="w-4 h-4" />
                    <LucidePlus v-else :size="15" />
                    <span>Qo'shish</span>    
                </Button>
            </div>
        </div>

        <div class="w-full flex flex-col-reverse md:flex-row gap-5">
            <div class="w-full md:flex-1">
                <div class="grid gap-5">
                    <Search v-model:model-value="pagination.search" :is-waiting="isWaiting" v-on:input="onInput" />
        
                    <div class="border h-full rounded-md overflow-auto">
                        <Table class="whitespace-nowrap">
                            <TableHeader>
                                <TableRow class="bg-muted/50">
                                    <TableHead class="w-10 h-9 py-2"><LucideListCheck :size="20" /> </TableHead>
                                    <TableHead class="w-full h-9 py-2">Masala</TableHead>
                                    <TableHead class="h-9 py-2">Qabul qilingan</TableHead>
                                    <TableHead class="h-9 py-2">Rank</TableHead>
                                    <TableHead class="h-9 py-2">Qiyinchiligi</TableHead>
                                    <TableHead class="h-9 py-2">Muallif</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-if="!isWaiting" v-for="(problem, index) in problems">
                                    <TableCell class="w-10 cursor-pointer">
                                        <LucideCircle v-tippy="`Attempted`" v-if="problem.status === 'attempted'" class="text-muted-foreground" :size="15" />
                                        <LucideCheck v-tippy="`Solved`" v-else-if="problem.status === 'solved'" class="text-green-500" :size="15" />
                                        <span></span>
                                    </TableCell>
                                    <TableCell class="cursor-pointer" @click="$router.push({ name: 'problems-uuid', params: { uuid: problem.uuid } })">
                                        <div class="flex flex-col gap-1">
                                            <div class="flex items-center gap-1"> 
                                                <span class="text-base">{{ problem.order }}. {{ problem.title }}</span>
                                                <LucideBadgeCheck class="text-green-500" :size="15" v-if="problem.is_public" />
                                            </div>
                                                <div class="flex gap-1">
                                                <Badge variant="secondary" v-for="tag in problem.tags" :key="tag.uuid" class="rounded-full text-xs font-normal">{{ tag.name }}</Badge>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span class="text-xs text-muted-foreground">{{ problem.acceptance }}%</span>
                                    </TableCell>
                                    <TableCell>
                                        <span>{{ problem.rank }}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span class="text-xs text-green-500 p-1" v-if="problem.difficulty === 'easy'">Easy</span>
                                        <span class="text-xs text-red-500 p-1" v-else-if="problem.difficulty === 'hard'">Hard</span>
                                        <span class="text-xs text-orange-500 p-1" v-else>Medium</span>
                                    </TableCell>
                                    <TableCell>
                                        <Avatar v-tippy="`${problem.author.full_name}`">
                                            <AvatarFallback>{{ problem.author.full_name.charAt(0) }} {{ problem.author.full_name.charAt(0) }}</AvatarFallback>
                                            <AvatarImage :src="problem.author.image"></AvatarImage>
                                        </Avatar>
                                    </TableCell>
                                </TableRow>
                                <TableRow v-for="_ in 10" v-if="isWaiting || isLoading">
                                    <TableCell>
                                        <Skeleton class="w-6 h-6 rounded-full" />
                                    </TableCell>
                                    <TableCell>
                                        <div class="flex flex-col gap-1">
                                            <Skeleton class="w-full h-4 rounded-full" />
                                            <div class="flex gap-1">
                                                <Skeleton v-for="_ in 3" class="w-10 h-4 rounded-full" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton class="w-10 h-6" /></TableCell>
                                    <TableCell><Skeleton class="w-10 h-6" /></TableCell>
                                    <TableCell><Skeleton class="w-6 h-6" /></TableCell>
                                    <TableCell><Skeleton class="w-8 h-8 rounded-full" /></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Empty v-if="problems.length === 0 && !isLoading && !isWaiting" />
                    </div>
        
                    <div class="w-full flex items-center justify-center">
                        <Pagination v-slot="{ page }" :items-per-page="10" :total="pagination.pages * 10" :sibling-count="1" show-edges :default-page="pagination.number">
                            <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                                <PaginationFirst :disabled="(isWaiting || isLoading) || pagination.pages === 1 || page === 1" @click="getProblems()" />
                                <PaginationPrev :disabled="(isWaiting || isLoading) || !pagination.previous" @click="getProblems(page - 1)" />
        
                                <template v-for="(item, index) in items">
                                    <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                                        <Button :disabled="isWaiting || isLoading" @click="getProblems(item.value)" class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
                                            {{ item.value }}
                                        </Button>
                                    </PaginationListItem>
                                    <PaginationEllipsis v-else :key="item.type" :index="index" />
                                </template>
        
                                <PaginationNext :disabled="(isWaiting || isLoading) || !pagination.next" @click="getProblems(page+1)" />
                                <PaginationLast :disabled="(isWaiting || isLoading) || pagination.pages === page" @click="getProblems(pagination.pages)" />
                            </PaginationList>
                        </Pagination>
                    </div>
                </div>
            </div>
            <div class="w-full md:w-80 flex flex-col gap-5">
                <AlgoCalendar :year="2025" :month="4" :data="data" />
                <p class="text-xl">Tags</p>
                <div class="flex flex-wrap gap-1">
                    <Badge v-for="tag in tags" :key="tag.uuid" variant="secondary" class="rounded-full">#{{ tag.name }}</Badge>
                </div>
            </div>
        </div>
    </div>
</template>