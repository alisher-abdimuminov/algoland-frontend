import type { Post, Tag } from "~/types/post";

export const usePostStore = defineStore("post", {
    state: (): { post: Post | null } => ({
        post: null
    }),
    actions: {
        set(post: Post) {
            this.post = post;
        }
    }
});

export const usePostTagsStore = defineStore("postTags", {
    state: (): { tags: Tag[] } => ({
        tags: []
    }),
    actions: {
        set(tags: Tag[]) {
            this.tags = tags;
        }
    }
});
