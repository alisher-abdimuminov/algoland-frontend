import type { IPage, IResponse } from "~/types";
import type { IProblems, IProblem, ILanguage, IProblemTag } from "~/types/problem";

export const useProblemsStore = defineStore("problems", {
    state: (): { problems: IProblems[], page: IPage } => ({
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
        concat(problems: IProblems[]) {
            this.problems.concat(problems);
        },
        async get() {
            let response = await $fetch<IResponse>(api("problems"));

            if (response.status === "error") {

            } else {
                let decoded = jsonify<{ page: IPage, problems: IProblems[] }>(decode(response.data));
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
    state: (): { problem: IProblem | null } => ({
        problem: null
    }),

    actions: {
        set(problem: IProblem){
            this.problem = problem;
        }
    }
});


export const useLanguagesStore = defineStore("languages", {
    state: (): { languages: ILanguage[] } => ({
        languages: []
    }),

    actions: {
        push(languages: ILanguage[]) {
            this.languages = languages;
        }
    }
});

export const useProblemTagsStore = defineStore("tags", {
    state: (): { tags: IProblemTag[] } => ({
        tags: []
    }),

    actions: {
        push(tags: IProblemTag[]) {
            this.tags = tags;
        }
    }
});
