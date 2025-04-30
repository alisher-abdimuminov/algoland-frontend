export interface ILang {
    name: string
    code: string
    flag: string
    locale: string
    translations: ITranslations
}

export interface ITranslations {
    [key: string]: string
}

export interface IResponse<T = string> {
    status: "success" | "error"
    code: T
    data: string
}

export interface IUser {
    uuid: string
    username: string
    email: string
    full_name: string
    country: string
    city: string
    gender: "male" | "female"
    birth_date: string
    is_birth_date: boolean
    is_premium: boolean
    permissions: string[]
    image: string
    bio: string
    role: "admin" | "light"
    followers: number
    following: number
    token: string
    session: string
}

export interface IProfile {
    id: number
    uuid: string
    username: string
    full_name: string
    country: string
    city: string
    image: string
    rank: number
    is_premium: boolean
    is_birth_date: boolean
    is_following: boolean
    last_seen: string
}

export interface ISession {
    uuid: string
    browser: {
        family: string
        version: string
    }
    device: {
        brand: string
        model: string
        family: string
    }
    os: {
        family: string
        version: string
    }
    ip: string
    is_active: boolean
    created: string
}

export type NotificationType = 
    | "follow"
    | "unfollow"
    | "like_to_post"
    | "comment_to_post"
    | "reply"
    | "mention"
    | "news"
    | "admin"

export interface INotification<T = object> {
    uuid: string
    type: NotificationType
    content: string
    is_readed: string
    props: T
    created: string
}

export interface IPage {
    pages: number
    number: number
    next: number | null
    previous: number | null
    search: string
    params?: {
        [key: string]: string
    } 
}

export interface IProfile {
    username: string
    email: string
    full_name: string
    country: string
    city: string
    is_premium: boolean
    is_birth_date: boolean
    image: string
    bio: string
    last_seen: string
    followers: number
    following: number
}

export interface IActivity {
    date: string
    attempts: number
    activity: number
}

export interface AlgoCalendarData {
    uuid: string
    date: string
    isSolved: boolean
    isFirstSolver: boolean
    title: string
    time: string
}

export type MessageCallback <T=string> = (data: WebSocketData<T>) => void;

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
