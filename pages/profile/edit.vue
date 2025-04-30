<script setup lang="ts">
import { LucideCheckCheck } from 'lucide-vue-next';



const { user } = useAuth();

const isWaiting = ref(false);
const userInfo = ref({
    full_name: user.value?.full_name ?? "",
    gender: user.value?.gender,
    country: user.value?.country,
    city: user.value?.city ?? "",
    bio: user.value?.bio ?? "",
    birth_date: user.value?.birth_date,
});


definePageMeta({
    middleware: ["is-auth"],
});


onMounted(() => {
});
</script>

<template>
    <Auth :is-auth="true" class="p-5 md:p-10 flex flex-col gap-5 mb-10">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink as-child>
                        <NuxtLink to="/home">Bosh sahifa</NuxtLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink as-child>
                        <NuxtLink to="/home">Hisob</NuxtLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>
                        Tahrirlash
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <div class="flex flex-col gap-5 md:gap-10" v-if="user && userInfo">
            <div class="flex flex-col gap-1 border rounded-md bg-accent/30 dark:bg-accent/10">
                <div class="flex flex-col gap-3 p-3 md:p-5">
                    <p class="text-xl md:text-2xl font-bold">Foydalanuvchi nomi</p>
                    <span class="text-xs md:text-sm">Foydalanuvchi nomini o'zgartirib bo'lmaydi.</span>
                    <div class="flex rounded-md shadow-xs">
                        <span
                            class="bg-accent/30 border-input whitespace-nowrap text-muted-foreground -z-10 inline-flex items-center rounded-s-md border px-3 text-sm">
                            algoland.uz/
                        </span>
                        <div class="relative w-full">
                            <Input v-model="user.username" class="-ms-px rounded-s-none shadow-none"/>
                            <div class="absolute top-0 right-0 w-10 h-full flex items-center justify-center">
                                <Copy :value="user.username" />
                            </div>
                        </div>
                    </div>
                </div>
                <Separator />
                <div class="p-3 md:p-5">
                    <span class="text-xs text-muted-foreground">Ko'pi bilan 32 ta belgidan foydalaning.</span>
                </div>
            </div>

            <div class="flex flex-col gap-1 border rounded-md bg-accent/30 dark:bg-accent/10">
                <div class="flex flex-col gap-3 p-3 md:p-5">
                    <p class="text-xl md:text-2xl font-bold">Email</p>
                    <span class="text-xs md:text-sm">Emailni o'zgartirib bo'lmaydi.</span>
                    <div class="relative">
                        <Input v-model="user.email" />
                        <div class="absolute top-0 right-0 w-10 h-full flex items-center justify-center">
                            <Copy :value="user.email" />
                        </div>
                    </div>
                </div>
                <Separator />
                <div class="p-3 md:p-5">
                    <span class="text-xs text-muted-foreground">Tizimga kirish uchun email tasdiqlanishi kerak. Tasdiqlangan emailni o'zgartirib bo'lmaydi.</span>
                </div>
            </div>

            <div class="flex flex-col gap-1 border rounded-md bg-accent/30 dark:bg-accent/10">
                <div class="flex flex-col gap-3 p-3 md:p-5">
                    <p class="text-xl md:text-2xl font-bold">To'liq ism</p>
                    <span class="text-xs md:text-sm"></span>
                    <div class="relative">
                        <Input v-model="userInfo.full_name" />
                        <div class="absolute top-0 right-0 w-10 h-full flex items-center justify-center">
                            <Copy :value="userInfo.full_name" />
                        </div>
                    </div>
                </div>
                <Separator />
                <div class="p-3 md:p-5">
                    <span class="text-xs text-muted-foreground">Ko'pi bilan 32 ta belgidan foydalaning.</span>
                </div>
            </div>

            <div class="flex flex-col gap-1 border rounded-md bg-accent/30 dark:bg-accent/10">
                <div class="flex flex-col gap-3 p-3 md:p-5">
                    <p class="text-xl md:text-2xl font-bold">Jins</p>
                    <span class="text-xs md:text-sm">Jinsingizni tanlang</span>
                    <Select v-model="userInfo.gender">
                        <SelectTrigger>
                            <SelectValue placeholder="Tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Erkak</SelectItem>
                            <SelectItem value="female">Ayol</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Separator />
                <div class="p-3 md:p-5">
                </div>
            </div>

            <div class="flex flex-col gap-1 border rounded-md bg-accent/30 dark:bg-accent/10">
                <div class="flex flex-col gap-3 p-3 md:p-5">
                    <p class="text-xl md:text-2xl font-bold">Mamlakat</p>
                    <span class="text-xs md:text-sm">Mamlakatingizni tanlang</span>
                    <Select v-model="userInfo.country">
                        <SelectTrigger>
                            <SelectValue placeholder="Tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="country in countries" :value="country.code">{{ country.name }} {{ country.flag }}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Separator />
                <div class="p-3 md:p-5">
                </div>
            </div>

            <div class="flex flex-col gap-1 border rounded-md bg-accent/30 dark:bg-accent/10">
                <div class="flex flex-col gap-3 p-3 md:p-5">
                    <p class="text-xl md:text-2xl font-bold">Shahar</p>
                    <span class="text-xs md:text-sm"></span>
                    <div class="relative">
                        <Input v-model="userInfo.city" />
                        <div class="absolute top-0 right-0 w-10 h-full flex items-center justify-center">
                            <Copy :value="userInfo.city" />
                        </div>
                    </div>
                </div>
                <Separator />
                <div class="p-3 md:p-5">
                    <span class="text-xs text-muted-foreground">Ko'pi bilan 32 ta belgidan foydalaning.</span>
                </div>
            </div>

            <div class="flex flex-col gap-1 border rounded-md bg-accent/30 dark:bg-accent/10">
                <div class="flex flex-col gap-3 p-3 md:p-5">
                    <p class="text-xl md:text-2xl font-bold">Tajimai xol</p>
                    <span class="text-xs md:text-sm"></span>
                    <div class="relative">
                        <Textarea maxlength="100" v-model="userInfo.bio" class="resize-none" />
                        <div class="absolute top-0 right-0 w-10 h-10 flex items-center justify-center">
                            <Copy :value="userInfo.bio" />
                        </div>
                        <div class="absolute bottom-0 right-0 p-1">
                            <span class="text-xs text-muted-foreground">{{ userInfo.bio.length }}/100</span>
                        </div>
                    </div>
                </div>
                <Separator />
                <div class="p-3 md:p-5">
                    <span class="text-xs text-muted-foreground">Ko'pi bilan 100 ta belgidan foydalaning.</span>
                </div>
            </div>

            <div class="flex flex-col gap-1 border rounded-md bg-accent/30 dark:bg-accent/10">
                <div class="flex flex-col gap-3 p-3 md:p-5">
                    <p class="text-xl md:text-2xl font-bold">Tug'ilgan sana</p>
                    <span class="text-xs md:text-sm"></span>
                    <div class="relative">
                        <Input v-model="userInfo.birth_date" />
                    </div>
                </div>
                <Separator />
                <div class="p-3 md:p-5">
                    <div><CodeSpan value="YYYY-mm-dd" /> <span class="text-xs text-muted-foreground">formatidan foydalaning.</span></div>
                </div>
            </div>

            <div class="flex flex-col gap-1 border rounded-md bg-accent/30 dark:bg-accent/10">
                <div class="flex flex-col gap-3 p-3 md:p-5">
                    <p class="text-xl md:text-2xl font-bold">Followers</p>
                    <span class="text-xs md:text-sm"></span>
                    <div class="relative">
                        <Input v-model="userInfo.birth_date" />
                    </div>
                </div>
                <Separator />
                <div class="p-3 md:p-5">
                    <div><CodeSpan value="YYYY-mm-dd" /> <span class="text-xs text-muted-foreground">formatidan foydalaning.</span></div>
                </div>
            </div>
        </div>
    </Auth>
    <div class="z-100 w-[calc(100%-3.5rem)] bg-background/70 backdrop-blur-sm border-t fixed bottom-0">
        <div class="flex items-center justify-end p-2 md:p-3">
            <Button :disabled="isWaiting">
                <Loader /> Saqlash
            </Button>
        </div>
    </div>
</template>
