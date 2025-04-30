import type { IPost, IPostTag } from "~/types/post";

export const usePostStore = defineStore("post", {
    state: (): { post: IPost | null } => ({
        post: null
    }),
    actions: {
        set(post: IPost) {
            this.post = post;
        }
    }
});

export const usePostTagsStore = defineStore("postTags", {
    state: (): { tags: IPostTag[] } => ({
        tags: []
    }),
    actions: {
        set(tags: IPostTag[]) {
            this.tags = tags;
        }
    }
});
