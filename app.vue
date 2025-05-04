<script setup lang="ts">
import type { WSNotification } from "~/types/codes";
import Toaster from '@/components/ui/toast/Toaster.vue';
import Sonner from './components/ui/sonner/Sonner.vue';


const ws = useWs();
const { user } = useAuth();
const { getShortcut } = useShortcuts();

const notificationsStore = useNotificationsStore();


onMounted(() => {
    if (user.value) {
        ws.connect(user.value.token);
        ws.onMessage<WSNotification>((message) => {
            if (message.type === "notification") {
                notificationsStore.unshift(message.data);
            }
        })
    }
});
</script>

<template>
    <Toaster />
    <Sonner />
    <Jump :shortcut="getShortcut('jump')" />
    <div>
        <NuxtLoadingIndicator />
        <NuxtRouteAnnouncer />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<style>
.katex-html {
    @apply hidden;
}

html.dark .shiki,
html.dark .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    /* Optional, if you also want font styles */
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
}

.shiki {
    @apply p-2 overflow-auto rounded-md border;
    counter-reset: step;
    counter-increment: step 0;
    .line {
        @apply border-l-4 border-transparent;
        &::before {
            counter-increment: step;
            @apply mr-6 inline-block w-4 border-transparent text-right text-neutral-600 content-[counter(step)];
        }

        &.highlighted,
        &.diff {
            @apply -ml-4 -mr-5 inline-block pl-4 pr-5;
        }

        &.highlighted {
            @apply *:!w-full opacity-70 *:!bg-neutral-500/30;
        }

        &.diff {
            &.add,
            &.remove {
                span:first-child::before {
                    @apply -ml-4 inline-flex w-4;
                }
            }
      
            &.add {
                @apply before:text-green-500;
                span:first-child::before {
                    @apply text-green-500 content-["+"];
                } 
            }
      
            &.remove {
                @apply before:text-red-500;
                span:first-child::before {
                    @apply text-red-500 content-["-"];
                }
            } 
        } 
    }
}

</style>
