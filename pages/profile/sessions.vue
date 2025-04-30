<script setup lang="ts">
import { LucideChevronDown } from 'lucide-vue-next';
import type { IPage, IResponse, ISession } from '~/types';
import format from '~/utils/datetime';



const { user } = useAuth();

const page = ref<IPage>({
    pages: 0,
    number: 1,
    next: null,
    previous: null,
    search: "",
});
const sessions = ref<ISession[]>([]);
const isWaiting = ref(false);
const isLoading = ref(true);


const getSessions = async (pageNumber: number = 1) => {
    isWaiting.value = true;
    const response = await $fetch<IResponse>(api("auth/sessions") + `?page=${pageNumber}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${user.value?.token}`
        }
    });
    
    if (response.status === "error") {
        
    } else {
        let decoded = jsonify<{ page: IPage, sessions: ISession[] }>(decode(response.data));
        
        if (decoded) {
            page.value = decoded.page;
            sessions.value.push(...decoded.sessions);
        }
    }
    isWaiting.value = false;
}

const disableSession = async (session: string) => {
    let response = await $fetch(api(`auth/sessions/${session}/disable`), {
        method: 'POST',
        headers: {
            'Authorization': `Token ${user.value?.token}`
        },
    });

    console.log(response);
}


definePageMeta({
    middleware: ["is-auth"],
});


onMounted(() => {
    getSessions(1);
    isLoading.value = false;
});
</script>

<template>
    <Auth :is-auth="true" class="p-5 md:p-10 flex flex-col gap-5">
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
                        <NuxtLink to="/home">Profil</NuxtLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>
                        Tizimga kirishlar
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="bg-accent/10 rounded-md border divide-y" v-if="user">
            <div v-for="session in sessions" class="flex items-center p-3" :key="session.uuid" v-tippy="session.uuid === user.session ? { content: 'Siz', placement: 'top' } : null">
                <div class="p-2">
                    <Android v-if="session.os.family === 'Android'" class="w-8 h-8" />
                    <Linux v-else-if="session.os.family === 'Linux'" class="w-8 h-8" />
                    <Apple v-else-if="session.os.family === 'iOS' || session.os.family === 'Mac OS X'" class="w-8 h-8" />
                    <Ubuntu v-else-if="session.os.family === 'Ubuntu'" class="w-8 h-8" />
                    <Windows v-else-if="session.os.family === 'Windows' || session.os.family === 'Windows Phone'" class="w-8 h-8" />
                    <Device v-else class="w-8 h-8" />
                </div>
                <div class="flex-1 flex items-center justify-between">
                    <div class="flex flex-col">
                        <span>{{ session.os.family }}</span>
                        <span class="text-sm">{{ session.browser.family }}</span>
                        <span class="text-muted-foreground text-xs">{{ format(session.created, true) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <Switch :id="session.uuid" :disabled="session.uuid === user.session || !session.is_active" v-model:model-value="session.is_active" @update:model-value="(value) => disableSession(session.uuid)" />
                    </div>
                </div>
            </div>
            <div v-if="isWaiting || isLoading" v-for="_ in 7" class="flex items-center p-3" >
                <div class="p-2">
                    <Skeleton class="w-8 h-8" />
                </div>
                <div class="flex-1 flex items-center justify-between">
                    <div class="flex flex-col gap-1">
                        <Skeleton class="w-32 h-5" />
                        <Skeleton class="w-10 h-4" />
                        <Skeleton class="w-10 h-4" />
                    </div>
                    <Skeleton class="w-10 h-6 rounded-full" />
                </div>
            </div>
            <div v-if="page.pages != page.number && (!isLoading && !isWaiting)" @click="getSessions(page.number + 1)" class="hover:bg-accent/30 cursor-pointer p-3 flex items-center justify-center gap-2 text-sm">
                <span>Ko'proq yuklash</span>
                <LucideChevronDown :size="20" />
            </div>
        </div>
    </Auth>
</template>