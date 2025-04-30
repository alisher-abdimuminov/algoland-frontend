import type { IProfile } from "."

export interface ITranslatedContent {
    [key: string]: string
}

export interface IProblemTag {
    id: string
    uuid: string
    name: string
}

export interface ISample {
    id: string
    input: string
    output: string
}

export interface IProblems {
    order: number
    uuid: string
    title: string
    author: IProfile
    status: "attempted" | "not_attempted" | "solved"
    acceptance: number
    tags: IProblemTag[]
    rank: number
    difficulty: "easy" | "medium" | "hard"
    time_limit: number
    memory_limit: number
    is_public: boolean
}

export interface ILanguage {
    id: string
    uuid: string
    name: string
    short: string
    icon: string
}

export interface IProblem {
    order: number
    uuid: string
    title: string
    author: IProfile
    status: "attempted" | "not_attempted" | "solved"
    acceptance: number
    tags: IProblemTag[]
    description: ITranslatedContent
    hint: ITranslatedContent
    input: ITranslatedContent
    output: ITranslatedContent
    samples: ISample[]
    rank: number
    difficulty: "easy" | "medium" | "hard"
    time_limit: number
    memory_limit: number
    with_link: boolean
    is_public: boolean
    language: string
    languages: ILanguage[]
}

export type TJudeStatus =
    | "ce" // Compilation Error
    | "cle" // Compilation Limit Exceeded
    | "re" // Runtime Error
    | "tle" // "Time Limit Exceeded",
    | "mle" // "Memory Limit Exceeded",
    | "ole" // "Output Limit Exceeded",
    | "pe" // "Presentation Error",
    | "wa" // "Wrong Answer",
    | "ac" // "Accepted",
    | "je" // "Judge Error",
    | "dce" // Dangerous Code Error

export interface IAttempt {
    id: string
    uuid: string
    language: ILanguage
    status: TJudeStatus
    code: string
    time: number
    memory: number
    length: number
    error: string | null
    test: number
    created: string
}
