<script setup lang="ts">
import * as z from "zod";
import { useForm } from "vee-validate";
import type { IResponse } from "~/types";
import { toast } from "~/components/ui/toast";
import { toTypedSchema } from '@vee-validate/zod';
import { LucideEye, LucideEyeOff } from 'lucide-vue-next';
import type { LoginCode, VerifyCode, WSNotification } from "~/types/codes";


// composables
const route = useRoute();
const router = useRouter();

const ws = useWs();
const { user } = useAuth();


// stores
const { t } = useTranslationsStore();
const notificationsStore = useNotificationsStore();


// vars
const isLoading = ref(true);
const isWaiting = ref(false);
const isToggled = ref(false);


const loginFormSchema = computed(() => toTypedSchema(z.object({
    username: z.string({ required_error: t("login_001") }),
    password: z.string({ required_error: t("login_002") }),
})));


const { handleSubmit, setFieldError, values } = useForm({
    validationSchema: loginFormSchema,
});


const getNotifications = async () => {
    const { user } = useAuth();
    if (user.value) {

        let response = await $fetch<IResponse>(api("notifications"), {
            method: "GET",
            headers: {
                Authorization: `Token ${user.value.token}`           
            }
        });

        if (response.status === "error") {

        } else {
            let decoded = jsonify<WSNotification[]>(decode(response.data));
            if (decoded) {
                notificationsStore.set(decoded);
            }
        }
    }
}


const login = handleSubmit(async (values) => {
    isWaiting.value = true;
    let response = await $fetch<IResponse<LoginCode>>(api("auth/login"), {
        method: "POST",
        body: JSON.stringify({
            "data": encode(JSON.stringify(values))
        })
    });

    if (response.code === "login_001") {
        setFieldError("username", t("login_001"));
    } else if (response.code === "login_002") {
        setFieldError("password", t("login_002"));
    } else if (response.code === "login_003") {
        setFieldError("username", t("login_003"));
    } else if (response.code === "login_004") {
        setFieldError("password", t("login_004"));
        toast({
            title: "Xatolik",
            description: t("login_004")
        });
    } else if (response.code === "login_005") {
        console.log(t("login_005"));
    } else if (response.code === "login_006") {
        router.push({ name: "auth-token", params: { token: encode(JSON.stringify({ username: values.username, expires: new Date(new Date().getTime() + 5 * 60 * 1000).getTime() })) } });
    } else if (response.code === "login_007") {
        user.value = response.data;
        toast({
            title: "Ajoyib",
            description: t("login_007")
        });
        if (route.query.next) {
            router.push(route.query.next.toString());
        } else {
            router.push({ name: "index" });
        }
        setTimeout(() => {
            ws.close();
            ws.reconnect();
            getNotifications();
        }, 1000);
    }
    
    isWaiting.value = false;
});


// native composables
definePageMeta({
    layout: "auth",
    middleware: ["is-not-auth"],
});

useSeoMeta({
    title: t("login"),
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
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight">Sign in to your account</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="login">
                <FormField v-slot="{ componentField }" name="username">
                    <FormItem>
                        <FormLabel for="username">{{ t("username") }}</FormLabel>
                        <FormControl>
                            <Input :disabled="isWaiting" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

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
                    <Button :disabled="isWaiting" class="w-full"><Loader v-if="isWaiting" /> {{ t("login") }}</Button>
                </div>
            </form>

            <p class="mt-10 text-center text-sm/6 text-gray-500">
                {{ t("dont_have_an_account") }}
                <NuxtLink :to="{ name: 'auth-signup' }" class="font-semibold text-blue-600 hover:text-blue-500">{{ t('signup') }}</NuxtLink>
            </p>
        </div>
    </Auth>
</template>