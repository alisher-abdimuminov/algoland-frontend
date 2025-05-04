export type NotificationType = 
    | "follow"
    | "unfollow"
    | "like_to_post"
    | "comment_to_post"
    | "reply"
    | "mention"
    | "admin"

export interface Notification<T = object> {
    uuid: string
    type: NotificationType
    content: string
    is_readed: string
    props: T
    created: string
}
