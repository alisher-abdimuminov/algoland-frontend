import type { Pagination, Response } from "~/types";
import type { Problem, ProgrammingLanguage, Tag } from "~/types/problem";

export const useProblemsStore = defineStore("problems", {
    state: (): { problems: Problem[], page: Pagination } => ({
        problems: [],
        page: {
            next: null,
            number: 1,
            pages: 1,
            previous: null,
            search: " ",
        }
    }),

    actions: {
        concat(problems: Problem[]) {
            this.problems.concat(problems);
        },
        async get() {
            let response = await $fetch<Response>(api("problems"));

            if (response.status === "error") {

            } else {
                let decoded = jsonify<{ page: Pagination, problems: Problem[] }>(decode(response.data));
                if (decoded) {
                    console.log(decoded);
                    this.problems.push(...decoded.problems);
                    this.page = decoded.page;
                }
            }
        }
    }
});


export const useProblemStore = defineStore("problem", {
    state: (): { problem: Problem | null } => ({
        problem: null
    }),

    actions: {
        set(problem: Problem){
            this.problem = problem;
        }
    }
});


export const useLanguagesStore = defineStore("languages", {
    state: (): { languages: ProgrammingLanguage[] } => ({
        languages: []
    }),

    actions: {
        push(languages: ProgrammingLanguage[]) {
            this.languages = languages;
        }
    }
});

export const useProblemTagsStore = defineStore("tags", {
    state: (): { tags: Tag[] } => ({
        tags: []
    }),

    actions: {
        push(tags: Tag[]) {
            this.tags = tags;
        }
    }
});
