export interface Response<T = string> {
    status: "success" | "error"
    code: T
    data: string
}

export interface Pagination {
    pages: number
    number: number
    next: number | null
    previous: number | null
    search: string
}

export interface Language {
    name: string
    code: string
    flag: string
    locale: string
    translations: Translations
}

export interface Translations {
    [key: string]: string
}

export type WebSocketDataType =
    | "notification"
    | "last_seen"
    | "attempt_case"
    | "read_notifications"
    | "attempt"
    | "like_to_post"
    | "update_post"
    | "follow"
    | "unfollow"

export interface WebSocketData<T> {
    type: WebSocketDataType
    data: T
}

export type MessageCallback <T=string> = (data: WebSocketData<T>) => void;
