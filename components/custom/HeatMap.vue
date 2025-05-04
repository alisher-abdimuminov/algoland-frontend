<script setup lang="ts">
import type { Activity } from '~/types/auth';


interface Props {
    data: Activity[]
    start: string
    end: string
    isLoading: boolean
}


const props = defineProps<Props>();

const { langInfo } = useLang();



function getMonthMatrixForYear(startDate: Date, endDate: Date): { monthName: string, label: string, matrix: (number | null)[][] }[] {
    const results: { monthName: string, label: string, matrix: (number | null)[][] }[] = []

    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth()
    const endYear = endDate.getFullYear()
    const endMonth = endDate.getMonth()

    for (let year = startYear; year <= endYear; year++) {
        const monthStart = year === startYear ? startMonth : 0
        const monthEnd = year === endYear ? endMonth : 11

        for (let month = monthStart; month <= monthEnd; month++) {
            let date = new Date(`${year}-${month + 1}-01`);
            const monthName = `${date.toLocaleString(langInfo.value.locale, { month: 'long' })}`;
            const label = `${year}-${(month + 1).toString().padStart(2, '0')}-`
            const matrix = getMonthMatrix(year, month)
            results.push({ monthName, label, matrix })
        }
    }

    return results
}

function getMonthMatrix(year: number, month: number): (number | null)[][] {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const matrix: (number | null)[][] = Array.from({ length: 7 }, () => [])

    const startDayIndex = (firstDay.getDay() + 6) % 7
    for (let i = 0; i < startDayIndex; i++) matrix[i].push(null)

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day)
        const dayIndex = (date.getDay() + 6) % 7
        matrix[dayIndex].push(day)
    }

    const maxLength = Math.max(...matrix.map(col => col.length))
    for (const col of matrix) while (col.length < maxLength) col.push(null)

    return matrix
}

const count = (month: string, day: number) => {
    let filter = props.data.filter((value) => value.date === month + day.toString().padStart(2, '0'));
    if (filter && filter.length > 0) {
        return filter[0].attempts;
    } else {
        return 0;
    }
}

</script>

<template>
    <div class="border rounded-md w-full h-full overflow-x-auto">
        <div v-if="isLoading" class="flex gap-2 overflow-auto p-2">
            <div class="flex flex-col items-center justify-center">
                <p class="w-10 h-4"></p>
                <div v-for="weekName in getLocalizedWeekdays()" class="w-10 text-sm text-muted-foreground">{{ weekName
                    }}</div>
            </div>
            <div v-for="month in getMonthMatrixForYear(new Date(start), new Date(end))">
                <p class="text-center text-sm mb-1 text-muted-foreground">{{ month.monthName }}</p>
                <div v-for="week in month.matrix" class="flex gap-1">
                    <div v-for="day in week" class="w-4 h-4 mb-1">
                        <Skeleton v-if="day" class="w-4 h-4 rounded"></Skeleton>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="flex gap-2 overflow-auto p-2">
            <div class="flex flex-col items-center justify-center">
                <p class="w-10 h-4"></p>
                <div v-for="weekName in getLocalizedWeekdays()" class="w-10 text-sm text-muted-foreground">{{ weekName
                    }}</div>
            </div>
            <div v-for="month in getMonthMatrixForYear(new Date(start), new Date(end))">
                <p class="text-center text-sm mb-1 text-muted-foreground">{{ month.monthName }}</p>
                <div v-for="week in month.matrix" class="flex gap-1">
                    <div v-for="day in week" class="w-4 h-4 mb-1"
                        v-tippy="day ? `${month.label}${day} ${count(month.label, day)}` : null"
                        :class="{
                            'bg-accent/50 rounded border': day,
                            'bg-green-200 border-none': day && count(month.label, day) > 0 && count(month.label, day) <= 10,
                            'bg-green-300 border-none': day && count(month.label, day) > 10 && count(month.label, day) <= 50,
                            'bg-green-400 border-none': day && count(month.label, day) > 50 && count(month.label, day) <= 100,
                            'bg-green-500 border-none': day && count(month.label, day) > 100,
                        }"
                        >
                    </div>
                </div>
            </div>
        </div>
        
        <div class="flex items-center bg-accent/10 gap-1 p-2 border-t">
            <p class="text-sm text-muted-foreground">Oz</p>
            <div v-tippy="{ content: '0', placement: 'top' }" class="border w-4 h-4 rounded bg-accent/30"></div>
            <div v-tippy="{ content: '1 ... 10', placement: 'top' }" class="w-4 h-4 rounded bg-green-200"></div>
            <div v-tippy="{ content: '11 ... 50', placement: 'top' }" class="w-4 h-4 rounded bg-green-300"></div>
            <div v-tippy="{ content: '51 ... 100', placement: 'top' }" class="w-4 h-4 rounded bg-green-400"></div>
            <div v-tippy="{ content: '101 ... n', placement: 'top' }" class="w-4 h-4 rounded bg-green-500"></div>
            <p class="text-sm text-muted-foreground">Ko'p</p>
        </div>
    </div>
</template>
