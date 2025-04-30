import type { IProfile } from "."


export interface IPostTag {
    id: string
    uuid: string
    name: string
}

export interface IPosts {
    id: number
    uuid: string
    author: IProfile
    title: string
    tags: IPostTag[]
    description: string
    created: string
    likes: number
    viewers: number
    comments: number
    is_liked: boolean
}

export interface IPost {
    id: number
    uuid: string
    author: IProfile
    title: string
    tags: IPostTag[]
    image: string
    description: string
    content: string
    created: string
    likes: number
    viewers: number
    comments: number
    is_liked: boolean
}
