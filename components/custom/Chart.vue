<template>
    <v-chart class="chart" :option="options" />
</template>

<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";

use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent
]);


interface Props {
    options: any
}

const props = defineProps<Props>();

provide(THEME_KEY, "light");

</script>

<style scoped>
.chart {
    height: 400px;
}
</style>