<script setup lang="ts">
// imports
import { LucideChevronLeft, LucideClock, LucideCpu } from 'lucide-vue-next';
import type { Pagination, Response } from '~/types';
import type { Attempt } from '~/types/problem';


// composables
const route = useRoute();
const router = useRouter();

// local composables
const { user } = useAuth();


// stores
const problemStore = useProblemStore();

const { problem } = storeToRefs(problemStore);


// variables
const pagination = ref<Pagination>({
    next: 0,
    number: 1,
    pages: 0,
    previous: 0,
    search: " "
});
const isWating = ref(false);
const isLoading = ref(true);
const openedAttempt = ref<Attempt | null>(null);
const attempts = ref<Attempt[]>([]);


const getAttempts = async (pageNumber: number = 1) => {
    if (user.value && problem.value) {

        isWating.value = true;
        let response = await $fetch<Response>(api(`problems/problem/${problem.value?.uuid}/attempts`) + `?page=${pageNumber}`, {
            method: "GET",
            headers: {
                Authorization: `Token ${user.value.token}`
            }
        });

        if (response.status === "error") {

        } else {
            let decoded = jsonify<{ page: Pagination, attempts: Attempt[] }>(decode(response.data));
            console.log(decoded);
            if (decoded) {
                pagination.value = decoded.page;
                attempts.value = decoded.attempts;
            }
        }

        router.push({ name: "problems-uuid-attempts", params: { uuid: problem.value.uuid }, query: { page: pagination.value.number } });
        isWating.value = false;
    }
}

definePageMeta({
    layout: "problem",
    middleware: ["is-auth", "problem-is-exists",],
});


if (route.query.page) {
    pagination.value.number = Number(route.query.page);
} else {
    pagination.value.number = 1;
}


onMounted(() => {
    getAttempts(pagination.value.number);
    isLoading.value = false;
});
</script>

<template>
    <Auth :is-auth="true" class="p-5">
        <Transition :name="openedAttempt ? 'slide-left' : 'slide-right'" mode="out-in">
            <div v-if="openedAttempt" class="flex flex-col gap-3">
                <div @click="openedAttempt = null"
                    class="px-2 py-1 flex w-fit items-center gap-1 hover:bg-accent/30 rounded-md cursor-pointer">
                    <LucideChevronLeft :size="16" />
                    <span>Ortga</span>
                </div>
                <div class="border rounded-md overflow-auto">
                    <Table>
                        <TableBody>
                            <TableRow class="hover:bg-transparent">
                                <TableCell>Holati</TableCell>
                                <TableCell>
                                    <span v-if="openedAttempt.status === 'ac'"
                                        class="text-green-500 bg-green-500/10 px-1 py-px rounded-md text-xs">
                                        Accepted
                                    </span>
                                    <span v-else-if="openedAttempt.status === 'ce'"
                                        class="text-red-500 bg-red-500/10 px-1 py-px rounded-md text-xs">Compilation
                                        Error</span>
                                    <span v-else-if="openedAttempt.status === 'cle'"
                                        class="text-red-500 text-xs bg-red-500/10 px-1 py-px rounded-md">Compilation
                                        Limit Error</span>
                                    <span v-else-if="openedAttempt.status === 'dce'"
                                        class="text-red-500 text-xs bg-red-500/10 px-1 py-px rounded-md">Danger Code
                                        Error</span>
                                    <span v-else-if="openedAttempt.status === 'je'"
                                        class="text-orange-500 bg-orange-500/10 px-1 py-px rounded-md text-xs">Judge
                                        Error
                                        ({{ openedAttempt.test }})</span>
                                    <span v-else-if="openedAttempt.status === 'mle'"
                                        class="text-red-500 bg-red-500/10 px-1 py-px rounded-md text-xs">Memory
                                        Limit ({{
                                            openedAttempt.test }})</span>
                                    <span v-else-if="openedAttempt.status === 'ole'"
                                        class="text-red-500 bg-red-500/10 px-1 py-px rounded-md text-xs">Output
                                        Limit ({{
                                            openedAttempt.test }})</span>
                                    <span v-else-if="openedAttempt.status === 'pe'"
                                        class="text-red-500 bg-red-500/10 px-1 py-px rounded-md text-xs">Presentation
                                        Error ({{ openedAttempt.test }})</span>
                                    <span v-else-if="openedAttempt.status === 're'"
                                        class="text-red-500 bg-red-500/10 px-1 py-px rounded-md text-xs">Runtime
                                        Error ({{
                                            openedAttempt.test }})</span>
                                    <span v-else-if="openedAttempt.status === 'tle'"
                                        class="text-red-500 bg-red-500/10 px-1 py-px rounded-md text-xs">Time Limit
                                        ({{
                                            openedAttempt.test }})</span>
                                    <span v-else-if="openedAttempt.status === 'wa'"
                                        class="text-red-500 bg-red-500/10 px-1 py-px rounded-md text-xs">Wrong
                                        Answer ({{
                                            openedAttempt.test }})</span>
                                    <span v-else-if="openedAttempt.status === 'running'"
                                        class="text-blue-500 bg-blue-500/10 px-1 py-px rounded-md text-xs">Running ({{
                                            openedAttempt.test }})</span>
                                </TableCell>
                            </TableRow>
                            <TableRow class="hover:bg-transparent">
                                <TableCell>Til</TableCell>
                                <TableCell>
                                    <div class="flex items-center gap-1 border rounded-md bg-accent/30 p-1 w-fit h-fit">
                                        <Icon :name="openedAttempt.language.icon" class="w-6 h-6" v-tippy="`${openedAttempt.language.name}`" />
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow class="hover:bg-transparent">
                                <TableCell>Vaqt</TableCell>
                                <TableCell>
                                    <div
                                        class="flex items-center gap-1 text-blue-500 bg-blue-500/10 px-1 py-px rounded-md w-fit">
                                        <LucideClock :size="15" />
                                        <span>{{ openedAttempt.time }} ms</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow class="hover:bg-transparent">
                                <TableCell>Xotira</TableCell>
                                <TableCell>
                                    <div
                                        class="flex items-center gap-1 text-green-500 bg-green-500/10 px-1 py-px rounded-md w-fit">
                                        <LucideCpu :size="15" />
                                        <span>{{ openedAttempt.memory / 1000 }} MB</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow class="hover:bg-transparent">
                                <TableCell>Sana</TableCell>
                                <TableCell>
                                    <span>{{ formatDateTime(openedAttempt.created, true) }}</span>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div class="flex flex-col gap-1">
                    <p>Code</p>
                    <Code :code="openedAttempt.code" :lang="openedAttempt.language.short" />
                </div>
                <div v-if="openedAttempt.error" class="flex flex-col gap-1">
                    <p>Xatolik</p>
                    <Code :code="openedAttempt.error" :lang="openedAttempt.language.short" />
                </div>
                <div v-if="openedAttempt.status === 'wa'" class="flex flex-col gap-1">
                    <p>Diff</p>
                    <div class="flex flex-col gap-0 border rounded-md p-0">
                        <span v-for="line in openedAttempt.cases[openedAttempt.cases.length - 1].diff.split('\n')" class="p-1" :class="{ 'bg-red-500/10 text-red-500': line.charAt(0) === '-', 'bg-green-500/10 text-green-500': line.charAt(0) === '+' }">{{ line }}</span>
                    </div>
                </div>
            </div>
            <div v-else class="flex flex-col gap-3">
                <div class="bg-background overflow-hidden rounded-md border">
                    <Table class="whitespace-nowrap">
                        <TableHeader>
                            <TableRow class="bg-muted/50">
                                <TableHead class="h-9 w-6 py-2">ID</TableHead>
                                <TableHead class="h-9 w-32 py-2">Holati</TableHead>
                                <TableHead class="h-9 w-20 py-2">Til</TableHead>
                                <TableHead class="h-9 w-20 py-2">Vaqt</TableHead>
                                <TableHead class="h-9 w-20 py-2">Xotira</TableHead>
                                <TableHead class="h-9 w-20 py-2">Sana</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-if="!isWating" v-for="(attempt, index) in attempts" :key="attempt.uuid"
                                @click="openedAttempt = attempt">
                                <TableCell>{{ attempt.id }}</TableCell>
                                <TableCell>
                                    <span v-if="attempt.status === 'ac'"
                                        class="text-green-500 bg-green-500/10 px-1 py-px rounded-md text-xs">Accepted</span>
                                    <span v-else-if="attempt.status === 'ce'"
                                        class="text-red-500 bg-red-500/10 px-1 py-px rounded-md text-xs">Compilation
                                        Error</span>
                                    <span v-else-if="attempt.status === 'cle'"
                                        class="text-red-500 bg-red-500/10 px-1 py-px rounded-md text-xs">Compilation
                                        Limit Error</span>
                                    <span v-else-if="attempt.status === 'dce'"
                                        class="text-red-500 text-xs bg-red-500/10 px-1 py-px rounded-md">Danger Code
                                        Error</span>
                                    <span v-else-if="attempt.status === 'je'"
                                        class="text-orange-500 bg-blue-500/10 px-1 py-px rounded-md text-xs">Judge Error
                                        ({{ attempt.test }})</span>
                                    <span v-else-if="attempt.status === 'mle'"
                                        class="text-red-500 bg-red-500/10 px-1 py-px rounded-md text-xs">Memory Limit ({{
                                            attempt.test }})</span>
                                    <span v-else-if="attempt.status === 'ole'"
                                        class="text-red-500 bg-red-500/10 px-1 py-px rounded-md text-xs">Output Limit ({{
                                            attempt.test }})</span>
                                    <span v-else-if="attempt.status === 'pe'"
                                        class="text-red-500 bg-red-500/10 px-1 py-px rounded-md text-xs">Presentation
                                        Error ({{ attempt.test }})</span>
                                    <span v-else-if="attempt.status === 're'"
                                        class="text-red-500 bg-red-500/10 px-1 py-px rounded-md text-xs">Runtime Error ({{
                                            attempt.test }})</span>
                                    <span v-else-if="attempt.status === 'tle'"
                                        class="text-red-500 bg-red-500/10 px-1 py-px rounded-md text-xs">Time Limit ({{
                                            attempt.test }})</span>
                                    <span v-else-if="attempt.status === 'wa'"
                                        class="text-red-500 bg-red-500/10 px-1 py-px rounded-md text-xs">Wrong Answer ({{
                                            attempt.test }})</span>
                                    <span v-else-if="attempt.status === 'running'"
                                        class="text-blue-500 bg-blue-500/10 px-1 py-px rounded-md text-xs">Running ({{
                                            attempt.test }})</span>
                                </TableCell>
                                <TableCell>
                                    <div class="flex items-center gap-1 border rounded-md bg-accent/30 p-1 w-fit">
                                        <Icon :name="attempt.language.icon" class="w-6 h-6" v-tippy="`${attempt.language.name}`" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div class="flex items-center gap-1">
                                        <LucideClock :size="15" />
                                        <span>{{ attempt.time }} ms</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div class="flex items-center gap-1">
                                        <LucideCpu :size="15" />
                                        <span>{{ attempt.memory / 1000 }} MB</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span>{{ formatDateTime(attempt.created, true) }}</span>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="isWating || isLoading" v-for="_ in 10" >
                                <TableCell><Skeleton class="w-4 h-4" /> </TableCell>
                                <TableCell><Skeleton class="w-full h-4" /> </TableCell>
                                <TableCell><Skeleton class="w-8 h-8" /> </TableCell>
                                <TableCell><Skeleton class="w-full h-4" /> </TableCell>
                                <TableCell><Skeleton class="w-full h-4" /> </TableCell>
                                <TableCell><Skeleton class="w-full h-4" /> </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Empty v-if="attempts.length === 0 && !isLoading && !isWating" />
                </div>
                <div class="w-full flex items-center justify-center overflow-auto">
                    <Pagination v-slot="{ page }" :items-per-page="10" :total="pagination.pages * 10" :sibling-count="1" show-edges :default-page="pagination.number">
                        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                            <PaginationFirst :disabled="(isWating || isLoading) || pagination.pages === 1 || page === 1" @click="getAttempts()" />
                            <PaginationPrev :disabled="(isWating || isLoading) || !pagination.previous" @click="getAttempts(page - 1)" />
    
                            <template v-for="(item, index) in items">
                                <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                                    <Button :disabled="isWating || isLoading" @click="getAttempts(item.value)" class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
                                        {{ item.value }}
                                    </Button>
                                </PaginationListItem>
                                <PaginationEllipsis v-else :key="item.type" :index="index" />
                            </template>
    
                            <PaginationNext :disabled="(isWating || isLoading) || !pagination.next" @click="getAttempts(page+1)" />
                            <PaginationLast :disabled="(isWating || isLoading) || pagination.pages === page" @click="getAttempts(pagination.pages)" />
                        </PaginationList>
                    </Pagination>
                </div>
            </div>

        </Transition>
    </Auth>
</template>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.2s;
}

.slide-left-enter-from {
    opacity: 0;
    transform: translate(50px, 0);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translate(-50px, 0);
}

.slide-right-enter-from {
    opacity: 0;
    transform: translate(-50px, 0);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translate(50px, 0);
}
</style>
