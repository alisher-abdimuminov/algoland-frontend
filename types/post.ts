import { type Profile } from "~/types/auth"

export interface Tag {
    id: string
    uuid: string
    name: string
}

export interface Post {
    id: number
    uuid: string
    author: Profile
    title: string
    tags: Tag[]
    image: string
    description: string
    content: string
    created: string
    likes: number
    viewers: number
    comments: number
    is_liked: boolean
}
