<script setup lang="ts">
// imports
import { LucideCalendar, LucideCalendarCheck, LucideCheckCircle, LucideFlame, LucideLayers3 } from 'lucide-vue-next';


// interfaces and types
export interface AlgoCalendarData {
    uuid: string
    date: string
    isSolved: boolean
    isFirstSolver: boolean
    title: string
    time: string
}

interface Props {
    year: number
    month: number
    data: AlgoCalendarData[]
}

// props, models, ...
const props = defineProps<Props>();


// composables
const { langInfo, t } = useLang();


// functions
const tooltip = computed(() => (year: number, month: number, day: number) => {
    return h("div", {
        class: "flex flex-col gap-2"
    }, [
        algoData.value(year, month, day)?.isFirstSolver ? h("div", {
            class: "flex items-center gap-1"
        }, [
            h(LucideFlame, {
                class: "text-green-500",
                size: 15,
            }),
            h("p", t("first_solution")),
        ]) : null,
        h("div", {
            class: "flex items-center gap-1"
        }, [
            h(LucideCalendar, { size: 15 }),
            h("p", {}, new Date(`${year}-${month}-${day}`).toLocaleString(langInfo.value.locale, {
                day: "2-digit",
                month: "long",
                year: "numeric"
            })),
        ]),
        algoData.value(year, month, day)?.isSolved ? h("div", {
            class: "flex items-center gap-1"
        }, [
            h(LucideCheckCircle, { size: 15 }),
            h("p", {}, algoData.value(year, month, day)?.time),
        ]) : null,
        h("div", {
            class: "flex items-center gap-1"
        }, [
            h(LucideLayers3, { size: 15 }),
            h("p", {}, algoData.value(year, month, day)?.title)
        ]),
    ])
});

function monthMatrix(year: number, month: number): (number | null)[][] {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const matrix: (number | null)[][] = [];
    let week: (number | null)[] = [];

    const getDayIndex = (date: Date) => (date.getDay() + 6) % 7;

    for (let i = 0; i < getDayIndex(firstDay); i++) {
        week.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month - 1, day);
        week.push(day);

        if (getDayIndex(date) === 6) {
            matrix.push(week);
            week = [];
        }
    }

    if (week.length > 0) {
        while (week.length < 7) {
            week.push(null);
        }
        matrix.push(week);
    }

    return matrix;
}

const algoData = computed(
    () => (year: number, month: number, day: number) => {
        let data = props.data.filter((value) => value.date === `${year}-${month.toString().padStart(2, '0')}-${day}`);
        if (data && data.length > 0) {
            return data[0];
        }
        return null;
    });

function isLeftConnected(year: number, month: number, day: number): boolean {
    return !!algoData.value(year, month, day) && !!algoData.value(year, month, day + 1)?.isSolved;
}

function isRightConnected(year: number, month: number, day: number): boolean {
    return !!algoData.value(year, month, day) && !!algoData.value(year, month, day - 1)?.isSolved;
}
</script>

<template>
    <div class="border rounded-md p-1 md:p-3 grid items-center justify-center gap-2 text-sm md:text-base">
        <!-- In next release -->
        <!-- <div class="flex items-center justify-between">
            <div class="hover:bg-accent/50 p-2 rounded-md cursor-pointer">
                <LucideChevronLeft :size="15" />
            </div>
            <p>{{ new Date(`${year}-${month}-1`).toLocaleDateString(langInfo.code, { month: "long", year: "numeric" }) }}</p>
            <div class="hover:bg-accent/50 p-2 rounded-md cursor-pointer">
                <LucideChevronRight :size="15" />
            </div>
        </div> -->
        <div class="flex">
            <div class="flex items-center justify-center w-8 h-8 m-1"
                v-for="weekName in getLocalizedWeekdays('narrow')">{{ weekName }}</div>
        </div>
        <div v-for="week in monthMatrix(year, month)" class="flex">
            <div v-for="(day, index) in week"
                class="relative w-8 h-8 rounded-md flex items-center justify-center m-1 z-100 cursor-pointer"
                @click="console.log(day)" v-tippy="day ? { content: tooltip(year, month, day) } : {}"
                :class="{ 'bg-accent border-none': day && isLeftConnected(year, month, day), 'bg-accent': day && isRightConnected(year, month, day), 'hover:bg-accent/30': day && !algoData(year, month, day) }">
                <template v-if="day && algoData(year, month, day)?.isSolved">
                    <LucideFlame class="text-green-500" v-if="algoData(year, month, day)?.isFirstSolver" :size="20" />
                    <LucideCalendarCheck class="text-green-500" v-else-if="algoData(year, month, day)?.isSolved"
                        :size="20" />
                </template>
                <div v-else-if="day" class="flex flex-col items-center text-sm">
                    {{ day }}
                    <div class="w-1 h-1 rounded-full bg-red-500"></div>
                </div>
                <div v-if="day && isLeftConnected(year, month, day)"
                    class="absolute h-8 bg-accent translate-x-1/2 z-[-1]" :class="index !== 6 ? 'w-full' : 'w-1/2'">
                </div>
                <div v-if="day && isRightConnected(year, month, day)"
                    class="absolute h-8 bg-accent -translate-x-1/2 z-[-1]" :class="index !== 0 ? 'w-full' : 'w-1/2'">
                </div>
            </div>
        </div>
    </div>
</template>
