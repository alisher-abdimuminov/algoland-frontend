<script setup lang="ts">
import { toast } from '~/components/ui/toast';
import type { IResponse } from '~/types';
import type { VerifyCode } from '~/types/codes';



const route = useRoute();
const router = useRouter();

const token = jsonify<{ username: string, expires: number }>(decode(route.params.token.toString()));
const otpOpened = ref(false);
const otp = ref<string[]>([]);
const otpVerified = ref(false);
const otpBorder = ref("");
const timeLeft = ref(59);
const isResend = ref(false);
let timer: NodeJS.Timeout;


if (token?.expires && token?.expires < new Date().getTime()) {
    router.push({ name: "auth-login" });
}


const verifyCode = async (value: string[]) => {
    let otp = value.join("");
    let response = await $fetch<IResponse<VerifyCode>>(api("auth/verify"), {
        method: "POST",
        body: JSON.stringify({
            "data": encode(JSON.stringify({
                "username": token?.username,
                "code": otp
            }))
        })
    });

    if (response.code === "verify_code_001") {
        toast({
            title: "Error",
            description: "username is required"
        });
    } else if (response.code === "verify_code_002") {
        toast({
            title: "Error",
            description: "code is required",
        });
    } else if (response.code === "verify_code_003") {
        toast({
            title: "Error",
            description: "Username is not found"
        });
    } else if (response.code === "verify_code_004") {
        toast({
            title: "Error",
            description: "User is already verified"
        });
    } else if (response.code === "verify_code_005") {
        toast({
            title: "Error",
            description: "Code is invalid"
        });
        otpBorder.value = "border border-red-500";
        otpVerified.value = false;
    }
     else {
        toast({
            title: "Ajoyib",
            description: "User is verified",
        });
        otpBorder.value = "border border-green-500";
        otpVerified.value = true;
        setTimeout(() => {
            router.push({ name: "auth-login", query: route.query });
        }, 500);
    }
}

const startTimer = () => {
    timeLeft.value = 59;
    timer = setInterval(() => {
        timeLeft.value--;

        if (timeLeft.value <= 0) {
            clearInterval(timer);
            isResend.value = true;
        }
    }, 1000);
}

const resendCode = async() => {
    isResend.value = false;
    startTimer();
}


// 
definePageMeta({
    layout: "auth",
    middleware: ["is-not-auth"],
});


// onMounted
onMounted(() => {
    startTimer();
});
</script>

<template>
    <Auth :is-auth="false">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm mt-10">
            <Logo class="mx-auto w-8 h-8" />
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight">Verify your email</h2>
            <p class="text-center text-muted-foreground">We send verification code to your email address.</p>
        </div>
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center justify-center gap-5">
            <PinInput otp v-model:model-value="otp" id="pin_input" @complete="verifyCode">
                <PinInputGroup class="flex items-center gap-3">
                    <PinInputInput v-for="(id, index) in 6" :key="id" :index="index" :class="otpBorder" class="bg-transparent size-9 rounded-md border" />
                </PinInputGroup>
            </PinInput>
            <div class="flex gap-1">
                <p>Kod bormadimi?</p>
                <p v-if="isResend" @click="resendCode">Resend</p>
                <p v-else>00:{{ timeLeft.toString().padStart(2, "0") }}</p>
            </div>
        </div>
    </Auth>
</template>