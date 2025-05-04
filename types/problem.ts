import type { User } from "~/types/auth"

export interface TranslatedContent {
    [key: string]: string
}

export interface Tag {
    id: string
    uuid: string
    name: string
}

export interface Sample {
    id: string
    input: string
    output: string
}

export interface ProgrammingLanguage {
    id: string
    uuid: string
    name: string
    short: string
    icon: string
}

export interface Problem {
    order: number
    uuid: string
    title: string
    author: User
    status: "attempted" | "not_attempted" | "solved"
    acceptance: number
    tags: Tag[]
    description: TranslatedContent
    hint: TranslatedContent
    input: TranslatedContent
    output: TranslatedContent
    samples: Sample[]
    rank: number
    difficulty: "easy" | "medium" | "hard"
    time_limit: number
    memory_limit: number
    with_link: boolean
    is_public: boolean
    language: string
    languages: ProgrammingLanguage[]
}

export type JudgeStatusType =
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

export interface Case {
    diff: string
    test: number
    time: number
    memory: number
    status: JudgeStatusType
    stdin: string
    stdout: string
    stderr: string
    expected: string
}

export interface Attempt {
    id: string
    uuid: string
    author: User
    language: ProgrammingLanguage
    status: JudgeStatusType
    code: string
    time: number
    memory: number
    length: number
    error: string | null
    test: number
    cases: Case[]
    created: string
}
