<script setup lang="ts">
// imports
import * as z from "zod";
import { Icon } from "@iconify/vue";
import { useForm } from "vee-validate";
import type { Response } from "~/types";
import { toast } from "~/components/ui/toast";
import type { SignUpCode } from "~/types/codes";
import { toTypedSchema } from '@vee-validate/zod';
import { LucideEye, LucideEyeOff } from 'lucide-vue-next';


// composables
const route = useRoute();
const router = useRouter();


// stores
const { t } = useTranslationsStore();


const isLoading = ref(true);
const isWaiting = ref(false);
const isToggled = ref(false);


const signUpFormSchema = computed(() => toTypedSchema(z.object({
    username: z.string({ required_error: t("signup_001") }),
    email: z.string({ required_error: t("signup_005") }).email({ message: t("signup_012") }),
    first_name: z.string({ required_error: t("signup_003") }),
    last_name: z.string({ required_error: t("signup_004") }),
    gender: z.enum(["male", "female"], { required_error: t("signup_006"), invalid_type_error: t("signup_008") }),
    country: z.string({ required_error: t("signup_007") }),
    password: z.string({ required_error: t("signup_002") }),
})));


const { handleSubmit, setFieldError } = useForm({
    validationSchema: signUpFormSchema,
});


const signup = handleSubmit(async(values) => {
    isWaiting.value = true;
    let response = await $fetch<Response<SignUpCode>>(api("auth/signup"), {
        method: "POST",
        body: JSON.stringify({
            "data": encode(JSON.stringify(values))
        })
    });
    
    if (response.code === "signup_001") {
        setFieldError("username", t("signup_001"));
    } else if (response.code === "signup_002") {
        setFieldError("password", t("signup_002"));
    } else if (response.code === "signup_003") {
        setFieldError("first_name", t("signup_003"));
    } else if (response.code === "signup_004") {
        setFieldError("last_name", t("signup_004"));
    } else if (response.code === "signup_005") {
        setFieldError("email", t("signup_005"));
    } else if (response.code === "signup_006") {
        setFieldError("gender", t("signup_006"));
    } else if (response.code === "signup_007") {
        setFieldError("country", t("signup_007"));
    } else if (response.code === "signup_008") {
        setFieldError("gender", t("signup_008"));
    } else if (response.code === "signup_009") {
        setFieldError("email", t("signup_009"));
    } else if (response.code === "signup_010") {
        setFieldError("username", t("signup_010"));
    } else if (response.code === "signup_011") {
        setFieldError("username", t("signup_011"));
    } else if (response.code === "signup_012") {
        setFieldError("username", t("signup_012"));
    } else if (response.code === "signup_013") {
        toast({
            title: "Ajoyib",
            description: t("signup_013"),
        });
        router.push({ name: "auth-login" });
    }
    isWaiting.value = false;
});


// native composables
definePageMeta({
    layout: "auth",
    middleware: ["is-not-auth"],
});

useSeoMeta({
    title: t("signup")
});


// onMounted
onMounted(() => {
    isLoading.value = false;
});

</script>

<template>
    <Auth :is-auth="false" class="sm:mx-auto sm:w-full sm:max-w-sm">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <Logo class="mx-auto w-8 h-8" />
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight">{{ t("join_us") }}</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm md:max-w-xl">
            <form class="space-y-6" @submit.prevent="signup">
                <FormField v-slot="{ componentField }" name="username">
                    <FormItem>
                        <FormLabel for="username">{{ t("username") }}</FormLabel>
                        <FormControl>
                            <Input :disabled="isWaiting" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="email">
                    <FormItem>
                        <FormLabel for="email">{{ t("email") }}</FormLabel>
                        <FormControl>
                            <Input :disabled="isWaiting" v-bind="componentField" type="email" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <div class="flex flex-col md:flex-row gap-3">
                    <FormField v-slot="{ componentField }" name="first_name">
                        <FormItem class="w-full">
                            <FormLabel for="first_name">{{ t("first_name") }}</FormLabel>
                            <FormControl>
                                <Input :disabled="isWaiting" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </div>

                <div class="flex flex-col md:flex-row gap-3">
                    <FormField v-slot="{ componentField }" name="last_name">
                        <FormItem class="w-full">
                            <FormLabel for="last_name">{{ t("last_name") }}</FormLabel>
                            <FormControl>
                                <Input :disabled="isWaiting" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </div>

                <div class="flex flex-col md:flex-row gap-3">
                    <FormField v-slot="{ componentField }" name="gender">
                        <FormItem class="w-full">
                            <FormLabel for="gender">{{ t("gender") }}</FormLabel>
                            <FormControl>
                                <Select :disabled="isWaiting" v-bind="componentField">
                                    <SelectTrigger>
                                        <SelectValue :placeholder="t('select_gender')" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">{{ t("male") }}</SelectItem>
                                        <SelectItem value="female">{{ t("female") }}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="country">
                        <FormItem class="w-full">
                            <FormLabel for="country">{{ t("country") }}</FormLabel>
                            <FormControl>
                                <Input :disabled="isWaiting" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </div>

                <FormField v-slot="{ componentField }" name="password">
                    <FormItem class="w-full">
                        <FormLabel for="password">{{ t("password") }}</FormLabel>
                        <div class="mt-2 relative">
                            <FormControl>
                                <Input :disabled="isWaiting" v-bind="componentField" :type="isToggled ? 'text' : 'password'" class="pr-12" />
                            </FormControl>
                            <div @click="isToggled = !isToggled" class="absolute cursor-pointer flex items-center justify-center top-0 right-0 w-10 h-full rounded-r-md bg-accent/30 border-l">
                                <LucideEye :size="20" v-if="!isToggled" />
                                <LucideEyeOff :size="20" v-else />
                            </div>
                        </div>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <div>
                    <Button :disabled="isWaiting" class="w-full"><Loader v-if="isWaiting" /> {{ t("signup") }}</Button>
                </div>
            </form>

            <p class="mt-10 text-center text-sm/6 text-gray-500">
                {{ t("do_you_have_an_account") }}
                <NuxtLink :to="{ name: 'auth-login' }" class="font-semibold text-blue-600 hover:text-blue-500">{{ t("login") }}</NuxtLink>
            </p>
        </div>
    </Auth>
</template>
