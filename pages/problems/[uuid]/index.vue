<script setup lang="ts">
import { LucideCheckCircle } from 'lucide-vue-next';
import mark from '~/composables/useMark';



const problemStore = useProblemStore();

const { problem } = storeToRefs(problemStore);



definePageMeta({
    layout: "problem",
    middleware: ["problem-is-exists"],
});

useHead({
    title: "Masala",
});
</script>

<template>
    <div class="p-5 flex flex-col gap-2" v-if="problem">
        <div class="flex items-center justify-between">
            <p class="text-2xl">{{ problem.order }}. {{ problem.title }}</p>
            <LucideCheckCircle :size="15" class="text-green-500" />
        </div>

        <div class="flex flex-wrap gap-1">
            <span class="text-xs bg-accent py-1 px-2 rounded-full">Time Limit: {{ problem.time_limit }} ms</span>
            <span class="text-xs bg-accent py-1 px-2 rounded-full">Memory Limit: {{ problem.memory_limit }} ms</span>
        </div>

        <div class="text-base">
            <p class="text-muted-foreground text-xs mt-2">Masala sharti</p>
            <component :is="node" v-for="node in mark(getTranslatedContent(problem.description, problem.language))" />
        </div>

        <div v-if="Object.keys(problem.input).length > 0" class="text-base">
            <p class="text-muted-foreground text-xs mt-2">Kirish oqimi</p>
            <component :is="node" v-for="node in mark(getTranslatedContent(problem.input, problem.language))" />
        </div>

        <div v-if="Object.keys(problem.output).length > 0" class="text-base">
            <p class="text-muted-foreground text-xs mt-2">Chiqish oqimi</p>
            <component :is="node" v-for="node in mark(getTranslatedContent(problem.output, problem.language))" />
        </div>

        <p class="text-muted-foreground text-xs mt-2" v-if="problem.samples.length > 0">Namunalar</p>
        <div class="border rounded-md overflow-auto" v-if="problem.samples.length > 0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-4">No</TableHead>
                        <TableHead class="border-l">Kirish</TableHead>
                        <TableHead class="border-l">Chiqish</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="(sample, index) in problem.samples">
                        <TableCell>{{ index + 1 }}</TableCell>
                        <TableCell class="border-l border-r">
                            <div class="flex items-start justify-between">
                                <div v-html="sample.input.replaceAll('\n', '<br />')"></div>
                                <Copy :value="sample.input" />
                            </div>
                        </TableCell>
                        <TableCell class="grid">
                            <div class="flex items-start justify-between">
                                <div v-html="sample.output.replaceAll('\n', '<br />')"></div>
                                <Copy :value="sample.output" />
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <p class="text-muted-foreground text-xs mt-2" v-if="problem.samples.length > 0">Muallif</p>
        <Profile class="bg-accent/50 border rounded-md p-2" :profile="problem.author" />
    </div>
</template>
