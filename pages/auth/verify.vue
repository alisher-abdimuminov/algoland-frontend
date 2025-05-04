<script setup lang="ts">
import type { Response } from '~/types';
import type { VerifyEmail } from '~/types/codes';


const route = useRoute();
const router = useRouter();

const { t } = useLang();

const isLoading = ref(true);
const error = ref("");


// 
definePageMeta({
    layout: "error",
    middleware: ["is-not-auth",],
});


// functions
const verify = async () => {
    let token = route.query.token ?? ""
    let response = await $fetch<Response<VerifyEmail>>(api("auth/verify") + `${token}/`, {
        method: "POST"
    });

    console.log(response);

    if (response.status === "error") {
        if (response.code === "verify_email_001" || response.code === "verify_email_002") {
            error.value = t("verify_link_not_found");
        } else {
            error.value = t("verify_link_expired");
        }
    } else {
        navigateTo({ name: "auth-login" });
    }

}

// onMounted
onMounted(() => {
    verify();
    isLoading.value = false;
});
</script>

<template>
    <Auth :is-auth="false">
        <Loader v-if="isLoading" />
        <div v-else-if="error" class="flex flex-col">
            <h class="text-3xl">Oops...</h>
            <span>{{ error }}</span>
        </div>
    </Auth>
</template>