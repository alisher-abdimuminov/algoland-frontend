<script setup lang="ts">
import type { IPage, IResponse, IProfile } from '~/types';
import useWs from "~/composables/useWs"
import type { WSUserStatus } from "~/types/codes";


const route = useRoute();
const router = useRouter();

const ws = useWs();
const { user } = useAuth();


const pagination = ref<IPage>({
    next: 0,
    number: 1,
    pages: 0,
    previous: 0,
    search: " "
});
const users = ref<IProfile[]>([]);
const isLoading = ref(true);
const isWaiting = ref(false);
let typingTimer: NodeJS.Timeout | null = null;


const onInput = (): void => {
    if (typingTimer) {
        clearTimeout(typingTimer);
    }

    typingTimer = setTimeout(() => {
        getUsers();
    }, 2000);
};


const getUsers = async (pageNumber: number = 1) => {
    isWaiting.value = true;
    let response = await $fetch<IResponse>(api("users") + `?page=${pageNumber}&search=${pagination.value.search}`, {
        method: "GET",
        headers: {
            ...(user ? {"Authorization": `Token ${user.value?.token}`} : {})
        }
    });

    if (response.status === "error") {

    } else {
        let decoded = jsonify<{ page: IPage, users: any[] }>(decode(response.data));
        if (decoded) {
            pagination.value = decoded.page;
            users.value = decoded.users;
        }
    }
    router.push({ name: "users", query: { page: pagination.value.number, search: pagination.value.search } });
    isWaiting.value = false;
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


useSeoMeta({
    title: `Foydalanuvchilar`,
});


onMounted(() => {
    getUsers();
    isLoading.value = false;

    ws.onMessage<WSUserStatus>((message) => {
        if (message.type === "last_seen") {
            let target = users.value.find((iuser) => iuser.uuid === message.data.uuid);
            if (target) {
                target.last_seen = message.data.last_seen;
            }
        }
    });
});
</script>

<template>
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
                    <BreadcrumbPage>
                        Foydalanuvchilar
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="flex flex-col gap-5">
            <Search v-model:model-value="pagination.search" :is-waiting="isWaiting" v-on:input="onInput" />

            <div class="flex flex-col">
                <Profile v-if="!isLoading && !isWaiting" class="odd:bg-accent/50 odd:border p-2 rounded-md" v-for="profile in users" :profile="profile" />
            
                <div v-if="isWaiting || isLoading" class="odd:bg-accent/50 odd:border p-2 w-full rounded-md flex items-center justify-between gap-1" v-for="_ in 5">
                    <div class="flex items-center gap-2">
                        <Skeleton class="w-10 h-10 rounded-full" />
                        <div class="grid gap-1">
                            <Skeleton class="w-32 h-4" />
                            <Skeleton class="w-1/2 h-3" />
                        </div>
                    </div>
                    <Skeleton class="w-10 h-10 rounded-full" />
                </div>
            </div>

            <div class="w-full flex items-center justify-center">
                <Pagination v-slot="{ page }" :items-per-page="10" :total="pagination.pages * 10" :sibling-count="1" show-edges :default-page="pagination.number">
                    <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                        <PaginationFirst :disabled="(isWaiting || isLoading) || pagination.pages === 1 || page === 1" @click="getUsers()" />
                        <PaginationPrev :disabled="(isWaiting || isLoading) || !pagination.previous" @click="getUsers(page - 1)" />

                        <template v-for="(item, index) in items">
                            <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                                <Button :disabled="isWaiting || isLoading" @click="getUsers(item.value)" class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
                                    {{ item.value }}
                                </Button>
                            </PaginationListItem>
                            <PaginationEllipsis v-else :key="item.type" :index="index" />
                        </template>

                        <PaginationNext :disabled="(isWaiting || isLoading) || !pagination.next" @click="getUsers(page+1)" />
                        <PaginationLast :disabled="(isWaiting || isLoading) || pagination.pages === page" @click="getUsers(pagination.pages)" />
                    </PaginationList>
                </Pagination>
            </div>
        </div>
    </div>
</template>