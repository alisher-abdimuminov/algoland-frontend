<script setup lang="ts">
import NumberFlow from "@number-flow/vue";
import { cva } from "class-variance-authority";
import { LucideChevronLeft, LucideDot, LucideEye, LucideHeart, LucideMessageCircle, LucideMinus, LucidePenSquare, LucidePlus } from 'lucide-vue-next';
import { buttonVariants } from "~/components/ui/button";
import mark from '~/composables/useMark';
import type { IPost } from '~/types/post';
import format from '~/utils/datetime';



const ws = useWs();
const { user } = useAuth();

const postStore = usePostStore();

const { post } = storeToRefs(postStore);

const isLoading = ref(true);


const likeToPost = () => {
    if (post.value && user.value && !post.value.is_liked) {
        ws.sendMessage({
            type: "like_to_post",
            data: {
                uuid: post.value.uuid
            }
        });
        post.value.is_liked = true;
    }
}


definePageMeta({
    middleware: ["post-is-exists",],
});

useSeoMeta({
    title: `"${post.value?.title}"`,
    description: post.value?.description,
    author: `${post.value?.author.first_name} ${post.value?.author.last_name}`,
    articleAuthor: [`${post.value?.author.first_name} ${post.value?.author.last_name}`],
    articlePublishedTime: format(post.value ? post.value.created : ''),
});


onMounted(() => {
    isLoading.value = false;

    ws.onMessage<{ post: IPost }>((message) => {
        if (message.type === "update_post") {
            post.value = message.data.post
        }
    });
});
</script>

<template>
    <div class="py-5 md:py-10 px-5 flex flex-col" v-if="post">
        <div class="flex flex-col md:items-center">
            <div class="max-w-3xl text-sm md:text-base">
                <div class="flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <Button @click="$router.push({ name: 'posts' })" size="sm" class="p-1" variant="ghost">
                            <LucideChevronLeft :size="15" /> Maqolalarga qaytish
                        </Button>
                        <NuxtLink :to="{ name: 'posts-uuid-edit', params: { uuid: post.uuid } }" :class="buttonVariants({ size: 'icon', variant: 'ghost' })">
                            <LucidePenSquare :size="20" />
                        </NuxtLink>
                    </div>
                    <span class="text-xs text-muted-foreground">{{ format(post.created) }}</span>
                    <p class="text-2xl md:text-4xl font-bold">{{ post.title }}</p>

                    <AspectRatio :ratio="16 / 9">
                        <img :src="`/api/v1/avatar/${post.title}`" class="rounded-md w-full h-full" alt="">
                    </AspectRatio>

                    <AspectRatio :ratio="16 / 9" v-if="isLoading">
                        <Skeleton class="w-full h-full" />
                    </AspectRatio>

                    <div class="flex items-center gap-0">
                        <Button size="sm" variant="ghost" class="flex items-center gap-1">
                            <LucideEye :size="15" />
                            <span>{{ post.viewers }}</span>
                        </Button>
                        <LucideDot />
                        <Button v-tippy="'Like to post'" @click="likeToPost" size="sm" :variant="post?.is_liked ? 'secondary' : 'ghost'" class="flex items-center gap-1">
                            <LucideHeart :size="15" :class="{ 'text-red-500': post.is_liked }" />
                            <NumberFlow :value="post.likes" :class="{ 'text-red-500': post.is_liked }" />
                        </Button>
                        <LucideDot />
                        <Button size="sm" variant="ghost" class="flex items-center gap-1">
                            <LucideMessageCircle :size="15" />
                            <span>{{ post.comments }}</span>
                        </Button>
                    </div>

                    <div class="flex flex-col">
                        <component v-for="node in mark(post.content)" :is="node" />
                        Lorem500
                    </div>

                    <Profile class="bg-accent/50 border rounded-md p-2" :profile="post.author" />
                </div>
            </div>
        </div>
    </div>
</template>