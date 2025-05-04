<script setup lang="ts">
import NumberFlow from "@number-flow/vue";
import { LucideClock, LucideDot, LucideEye, LucideHeart, LucideMinus, LucidePenSquare, LucidePlus, LucideSearch } from 'lucide-vue-next';
import type { Pagination, Response } from '~/types';
import type { Post } from '~/types/post';


const route = useRoute();
const router = useRouter();

const ws = useWs();
const { user } = useAuth();

const isLoading = ref(true);
const isWaiting = ref(false);
const posts = ref<Post[]>([]);
let typingTimer: NodeJS.Timeout | null = null;
const pagination = ref<Pagination>({
    next: 0,
    number: 1,
    pages: 0,
    previous: 0,
    search: " "
});


const onInput = (): void => {
    console.log("done");
    if (typingTimer) {
        clearTimeout(typingTimer);
    }

    typingTimer = setTimeout(() => {
        getPosts();
    }, 2000);
};

const getPosts = async (pageNumber: number = 1) => {
    isWaiting.value = true;
    let response = await $fetch<Response>(api("posts") + `?page=${pageNumber}&search=${pagination.value.search}`, {
        method: "GET",
        headers: {
            ...(user ? { "Authorization": `Token ${user.value?.token}` } : {})
        }
    });

    if (response.status === "error") {

    } else {
        let decoded = jsonify<{ page: Pagination, posts: Post[] }>(decode(response.data));
        console.log(decoded);
        if (decoded) {
            pagination.value = decoded.page;
            posts.value = decoded.posts;
        }
    }
    router.push({ name: "posts", query: { page: pagination.value.number, search: pagination.value.search } });
    isWaiting.value = false;
}

const addPost = async () => {
    isWaiting.value = true;
    if (user.value) {
        let response = await $fetch<Response>(api("posts/add"), {
            method: "POST",
            headers: {
                Authorization: `Token ${user.value.token}`
            }
        });

        if (response.status === "error") {

        } else {
            let decoded = jsonify<{ uuid: string }>(decode(response.data));

            if (decoded) {
                navigateTo({ name: "posts-uuid", params: { uuid: decoded.uuid } });
            }
        }
    }
    isWaiting.value = true;
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
    title: `Maqolalar`,
});


onMounted(() => {
    getPosts();
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
                <Button :disabled="isWaiting || isLoading" @click="addPost" size="sm">
                    <Loader v-if="isWaiting || isLoading" class="w-4 h-4" />
                    <LucidePenSquare v-else :size="15" />
                    <span>Yozish</span>
                </Button>
            </div>
        </div>
        <Search v-model:model-value="pagination.search" :is-waiting="isWaiting" v-on:input="onInput" />
        <div class="flex gap-5 flex-col-reverse md:flex-row">
            <div class="flex-1 flex flex-col gap-5">
                <div v-for="post in posts" class="bg-accent/30 rounded-md p-3 grid gap-3">
                    <Profile class="p-0" :profile="post.author" />
                    <Separator />
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-1 text-xs text-muted-foreground">
                            <LucideClock :size="15" />
                            <span class="">{{ formatDateTime(post.created) }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="flex items-center gap-1">
                                <LucideEye :size="15" class="" />
                                <NumberFlow class="text-xs" :value="post.viewers" />
                            </div>
                            <div class="flex items-center gap-1">
                                <LucideHeart :size="15" class="" />
                                <NumberFlow class="text-xs" :value="post.likes" />
                            </div>
                        </div>
                    </div>
                    <NuxtLink :to="{ name: 'posts-uuid', params: { uuid: post.uuid } }"
                        class="text-2xl hover:underline underline-offset-4">{{ post.title }}</NuxtLink>
                    <p class="text-muted-foreground">{{ post.description }}</p>
                </div>
                <Skeleton v-if="isWaiting || isLoading" v-for="_ in 5" class="w-full h-56" />
            </div>
            <div class="w-full md:w-1/3">
                <div class="sticky top-5">
                    <div
                        class="flex flex-col items-center justify-center gap-3 border w-full h-64 bg-accent/30 rounded-md">
                        <LucidePenSquare class="text-green-500" :size="30" />
                        <p>Write your first post</p>
                        <p>Bilimlaringizni barcha bilan ulashing.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>