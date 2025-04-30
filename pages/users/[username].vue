<script setup lang="ts">
import { LucideBadgeCheck, LucideCake } from 'lucide-vue-next';
import type { IActivity, IResponse } from '~/types';
import { toast } from '~/components/ui/toast';
import { type EChartsOption } from "echarts";



const route = useRoute();

const { user } = useAuth();
const { theme } = useTheme();

const userStore = useUserStore();

const { profile } = storeToRefs(userStore);

const activities = ref<IActivity[]>([]);
const waitingForActivities = ref(true);


const ranks = [
    {
        contest: "Round 1",
        rank: 1362,
    },
    {
        contest: "Round 2",
        rank: 1521,
    },
    {
        contest: "Round 4",
        rank: 1201,
    },
    {
        contest: "Round 5",
        rank: 1311,
    },
];


const getActivities = async () => {
    waitingForActivities.value = true;
    let response = await $fetch<IResponse>(api(`users/${route.params.username}/activities`));

    if (response.status === "error") {
        toast({
            title: "Xatolik",
            description: "Foydalanuvchi faolligi ma'lumotlarini olishda xatolik yuz berdi",
        });
    } else {
        let decoded = jsonify<IActivity[]>(decode(response.data));

        if (decoded) {
            activities.value = decoded;
        }
    }
    waitingForActivities.value = false;
}

const option = ref<EChartsOption>({
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '70%'],
            // adjust the start and end angle
            startAngle: 180,
            endAngle: 360,
            data: [
                { value: 1048, name: 'Oson' },
                { value: 735, name: 'Ortacha' },
                { value: 580, name: 'Qiyin' },
            ]
        }
    ]
});


definePageMeta({
    middleware: ["user-is-exists"],
})


onMounted(() => {
    getActivities();
});
</script>

<template>
    <div class="p-5 md:p-10 flex flex-col gap-5 w-full" v-if="profile">
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
                        <NuxtLink to="/users">Foydalanuvchilar</NuxtLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>
                        <span>{{ profile.username }}</span>
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="flex flex-col md:flex-row gap-5 md:gap-10 relative">
            <div class="w-full md:w-64">
                <div class="sticky top-5 flex flex-col gap-3">
                    <div class="relative w-full h-64 flex items-center justify-center">
                        <img class="w-64 h-64 rounded-md object-cover" :src="`/api/v1/avatar/${profile.username}`" alt="Generated avatar" />
                        <div class="absolute bottom-3 right-6 md:right-3">
                            <span>{{ getCountryByCode(profile.country)?.flag }}</span>
                        </div>
                    </div>
                    <div class="text-xl flex items-center gap-2">
                        <p v-tippy="{ content: `${profile.full_name}`, placement: 'top' }" class="w-full truncate">{{
                            profile.full_name }}</p>
                        <LucideBadgeCheck v-if="profile.is_premium" :size="20" class="text-blue-500" />
                        <LucideCake v-if="profile.is_birth_date" :size="20" class="text-green-500" />
                    </div>

                    <span v-if="profile.last_seen === 'online'" class="text-green-500 text-xs">{{ lastSeen(profile.last_seen) }}</span>
                    <span v-else class="text-blue-500 text-xs">Oxirigi marta {{ lastSeen(profile.last_seen) }}</span>

                    <div class="flex flex-col gap-1">
                        <span class="text-xs text-muted-foreground">Tarjimai xol</span>
                        <p class="text-sm">{{ profile.bio }}</p>
                    </div>

                    <div class="flex items-center justify-between divide-x">
                        <div class="w-full flex flex-col items-center justify-center">
                            <p class="text-sm text-muted-foreground">Followers</p>
                            <p class="text-xl">{{ profile.followers }}</p>
                        </div>
                        <div class="w-full flex flex-col items-center justify-center">
                            <p class="text-sm text-muted-foreground">Following</p>
                            <p class="text-xl">{{ profile.following }}</p>
                        </div>
                    </div>

                    <Button>Follow</Button>
                </div>
            </div>
            <div class="flex-1 flex flex-col gap-5 md:gap-10">
                <div class="flex flex-col md:flex-row gap-5">
                    <div class="w-full md:w-1/2 grid grid-cols-2">
                        <div class="flex flex-col gap-1 items-center justify-center p-3 border-r">
                            <span class="text-sm text-muted-foreground">Reyting</span>
                            <span class="text-xl font-bold text-green-500">1982</span>
                        </div>
                        <div class="flex flex-col gap-1 items-center justify-center p-3">
                            <span class="text-sm text-muted-foreground">Masalalar</span>
                            <span class="text-xl font-bold text-blue-500">254</span>
                        </div>
                        <div class="flex flex-col gap-1 items-center justify-center p-3  border-t border-r">
                            <span class="text-sm text-muted-foreground">Urinishlar</span>
                            <span class="text-xl font-bold text-sky-500">254</span>
                        </div>
                        <div class="flex flex-col gap-1 items-center justify-center p-3 border-t">
                            <span class="text-sm text-muted-foreground">Musobaqalar</span>
                            <span class="text-xl font-bold text-orange-500">254</span>
                        </div>
                    </div>
                </div>

                <div class="grid">
                    <HeatMap class="w-full" :data="activities" start="2024-09-15" end="2025-04-15" v-bind:is-loading="waitingForActivities" />
                </div>
            </div>
        </div>
    </div>
</template>