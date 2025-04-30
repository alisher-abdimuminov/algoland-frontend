<script setup lang="ts">


const { user, logout } = useAuth();


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
                <Button @click="$router.push({ name: 'auth-login' })" size="sm" variant="outline">Login</Button>
                <Button @click="$router.push({ name: 'auth-signup' })" size="sm" variant="default">SignUp</Button>
            </div>
            <div v-else class="flex items-center gap-2">
                <Button @click="logout" size="sm" variant="outline">Logout</Button>
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
            <span class="text-muted-foreground text-sm w-1/2">Platform developed and maintained by Ali.</span>
            <!-- <Separator /> -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                <div>
                    <p>Bosh sahifa</p>
                    <p>Masalalar</p>
                    <p>Foydalanuvchilar</p>
                    <p>Musobaqalar</p>
                    <p>Sinovlar</p>
                    <p>Calendar</p>
                </div>
                <div>
                    <p>Languages</p>
                    <p>Problems</p>
                    <p>Tests</p>
                    <p>Judge</p>
                </div>
            </div>
            <Separator />
            <span class="text-center md:text-start text-muted-foreground">&copy; 2025 Algoland Labs. All Rights Reserved.</span>
        </footer>
    </div>
</template>