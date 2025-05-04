<script setup lang="ts">
import { buttonVariants } from '~/components/ui/button';



const { user, logout } = useAuth();
const { t } = useLang();


</script>

<template>
    <div class="">
        <header class="h-[3rem] z-50 flex sticky top-0 items-center justify-between border-b bg-background/70 backdrop-blur-md px-5 md:px-24">
            <div class="flex items-center gap-1">
                <Logo class="w-6 h-6" />
                <p class="font-bold">algoland</p>
            </div>
            <div></div>
            <div v-if="!user" class="flex items-center gap-2">
                <Button @click="$router.push({ name: 'auth-login' })" size="sm" variant="outline">{{ t("login") }}</Button>
                <Button @click="$router.push({ name: 'auth-signup' })" size="sm" variant="default">{{ t("signup") }}</Button>
            </div>
            <div v-else class="flex items-center gap-2">
                <NuxtLink :to="{ name: 'home' }" :class="buttonVariants({ size: 'sm', variant: 'outline' })">{{ t("get_started") }}</NuxtLink>
            </div>
        </header>
        <main>
            <slot />
        </main>
        <footer class="mt-10 bg-accent/30 px-5 md:px-24 py-10 flex flex-col gap-5">
            <div class="flex items-center gap-1">
                <Logo class="w-6 h-6" />
                <p class="font-bold">algoland</p>
            </div>
            <span class="text-muted-foreground text-sm w-1/2">{{ t("platform_developed_and_maintained") }}</span>
            <!-- <Separator /> -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                <div class="flex flex-col">
                    <NuxtLink class="hover:underline underline-offset-4" :to="{ name: 'index' }">{{ t("home") }}</NuxtLink>
                    <NuxtLink class="hover:underline underline-offset-4" :to="{ name: 'problems' }">{{ t("problems") }}</NuxtLink>
                    <NuxtLink class="hover:underline underline-offset-4" :to="{ name: 'users' }">{{ t("users") }}</NuxtLink>
                    <NuxtLink class="hover:underline underline-offset-4" :to="{ name: 'contests' }">{{ t("contests") }}</NuxtLink>
                    <NuxtLink class="hover:underline underline-offset-4">{{ t("calendar") }}</NuxtLink>
                </div>
            </div>
            <Separator />
            <span class="text-center md:text-start text-muted-foreground">&copy; {{ new Date().getFullYear() }} AlgoLand. {{ t("all_rights_reserved") }}</span>
        </footer>
    </div>
</template>