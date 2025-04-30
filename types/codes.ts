export type SignUpCode = 
    | "signup_001"
    | "signup_002"
    | "signup_003"
    | "signup_004"
    | "signup_005"
    | "signup_006"
    | "signup_007"
    | "signup_008"
    | "signup_009"
    | "signup_010"
    | "signup_011";

export type LoginCode =
    | "login_001"
    | "login_002"
    | "login_003"
    | "login_004"
    | "login_005"
    | "login_006"
    | "login_007";


export type VerifyCode =
    | "verify_code_001"
    | "verify_code_002"
    | "verify_code_003"
    | "verify_code_004"
    | "verify_code_005"
    | "verify_code_006";

export type AddProblem = 
    | "add_problem_001"

export interface WSNotification<T=object> {
    uuid: string
    type: "all" | string
    title: string
    content: string
    is_readed: boolean
    props: T
    created: string
}

export interface WSUserStatus {
    uuid: string
    last_seen: "online" | string
}
