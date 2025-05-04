<script setup lang="ts">
import { LucideBot, LucideHeart } from 'lucide-vue-next';
import type { Response } from '~/types';
import type { Notification } from '~/types/notification';



const { user } = useAuth();

const isLoading = ref(true);
const isWaiting = ref(false);


const notifications = ref<Notification[]>([])


const getNotificaitons = async () => {
    isWaiting.value = true;
    if (user.value) {

        let response = await $fetch<Response>(api("notifications") + "?all=true", {
            method: "GET",
            headers: {
                Authorization: `Token ${user.value.token}`           
            }
        });

        if (response.status === "error") {

        } else {
            let decoded = jsonify<Notification[]>(decode(response.data));
            if (decoded) {
                notifications.value = decoded;
            }
        }
    }
    isWaiting.value = false;
}


onMounted(() => {
    getNotificaitons();
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
                        <NuxtLink to="/home">Hisob</NuxtLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>
                        Bildirishnomalar
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <div class="flex flex-col gap-5 border bg-accent/30 dark:bg-accent/10 p-3 md:p-5 rounded-md divide-y" v-if="user">
            <div class="flex items-start gap-2 pt-3" v-for="notification in notifications">
                <Avatar v-if="notification.type === 'admin'">
                    <AvatarImage :src="`/api/v1/avatar/${user.username}`"></AvatarImage>
                </Avatar>
                <div v-else class="w-10 h-10 rounded-full border flex items-center justify-center bg-accent/30">
                    <LucideBot :size="15" />
                </div>
                <div class="flex flex-col gap-2 flex-1">
                    <div class="flex items-center justify-between">
                        <p class="text-sm">New follower</p>
                        <div class="flex items-center gap-1">
                            <span class="text-muted-foreground text-xs">{{ formatDateTime(notification.created) }}</span>
                        </div>
                    </div>
                    <div class="text-xs flex items-center gap-1">
                        <LucideHeart class="fill-red-500 stroke-red-500" :size="15" />
                        {{ notification.content }}
                    </div>
                </div>
            </div>
        </div>
    </Auth>
</template>