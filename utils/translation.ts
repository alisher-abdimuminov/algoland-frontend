import type { ITranslatedContent } from "~/types/problem";

export const getTranslatedContent = (content: ITranslatedContent, defaultLang: string) => {
    const { lang } = useLang();

    if (content[lang.value]) {
        return content[lang.value];
    } else {
        return content[defaultLang];
    }
}