export interface User {
    id: string
    uuid: string
    username: string
    email: string
    first_name: string
    last_name: string
    country: string
    city: string
    gender: "male" | "female"
    is_premium: boolean
    is_following: boolean
    permissions: string[]
    image: string
    rating: number
    coach: User | null
    bio: string
    role: "admin" | "light"
    last_seen: string
    followers: number
    following: number
    token: string
    session: string
}

export interface Session {
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

export interface Activity {
    date: string
    attempts: number
    activity: number
}
