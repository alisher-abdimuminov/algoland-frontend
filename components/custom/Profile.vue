<script setup lang="ts">
import { LucideBadgeCheck, LucideMinus, LucidePlus } from 'lucide-vue-next';
import type { User } from '~/types/auth';
import type { WSUserStatus } from '~/types/codes';


const props = defineProps<{ profile: User }>();

const ws = useWs();
const { user } = useAuth();


const follow = () => {
    if (user.value && props.profile &&ws) {
        ws.sendMessage({
            type: "follow",
            data: {
                "username": props.profile.username,
            }
        });
        props.profile.is_following = true;
    }
}

const unfollow = () => {
    if (user.value && props.profile && ws) {
        ws.sendMessage({
            type: "unfollow",
            data: {
                "username": props.profile.username,
            }
        });
        props.profile.is_following = false;
    }
}


onMounted(() => {
    if (user.value) {
        ws.onMessage<WSUserStatus>((message) => {
            if (message.type === "last_seen") {
                if (message.data.uuid === props.profile.uuid) {
                    props.profile.last_seen = message.data.last_seen;
                }
            }
        });
    }
});
</script>

<template>
    <div class="flex items-center justify-between gap-1">
        <div class="flex items-center gap-2">
            <div class="relative" v-tippy="profile.last_seen === 'online' ? 'Online' : lastSeen(profile.last_seen)">
                <Avatar size="sm">
                    <AvatarImage :src="`/api/v1/avatar/${profile.username}`"></AvatarImage>
                    <AvatarFallback>AP</AvatarFallback>
                </Avatar>
                <div class="absolute z-100 bg-white rounded-full bottom-2 right-1 w-3 h-3 flex items-center justify-center">
                    <div class="w-2 h-2 rounded-full" :class="profile.last_seen === 'online' ? 'bg-green-500' : 'bg-red-500'"></div>
                </div>
            </div>
            <div class="grid gap-0">
                <NuxtLink :to="{ name: 'users-username', params: { username: profile.username } }" class="flex items-center gap-1 truncate text-sm md:text-base">
                    <p class="truncate">{{ getCountryByCode(profile.country)?.flag }} {{ profile.first_name }} {{ profile.last_name }}</p>
                    <LucideBadgeCheck v-if="profile.is_premium" class=text-blue-500 :size="20" />
                </NuxtLink>
                <span class="text-xs text-muted-foreground font-bold">{{ profile.rating }}</span>
            </div>
        </div>
        <div v-if="user && !profile.is_following && user.uuid !== profile.uuid">
            <Button @click="follow" class="rounded-full text-xs" size="icon">
                <LucidePlus :size="15" />
            </Button>
        </div>
        <div v-else-if="user && user.uuid !== profile.uuid">
            <Button @click="unfollow" class="rounded-full text-xs" size="icon">
                <LucideMinus :size="15" />
            </Button>
        </div>
    </div>
</template>
