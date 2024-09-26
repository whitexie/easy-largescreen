<script setup lang="ts">
import type { ChartRenderState } from '@/types/charts';
import { useChartRender } from '../ChartDesigner/composables/useChartRender';
import BaseChart from './BaseChart.vue';

interface Props {
  chartConfig: ChartRenderState
  data?: Record<string, string | number>[]
}

const props = withDefaults(
  defineProps<Props>(),
  { data: () => [] },
);

const errorMessage = ref('');
const { buildG2Options, updateState } = useChartRender(props.chartConfig);
const options = ref<Record<string, any>>({});

function buildChartOptions() {
  try {
    errorMessage.value = '';
    options.value = buildG2Options();
  }
  catch (error) {
    errorMessage.value = (error as Error).message;
  }
}

watch(
  props.chartConfig,
  (val) => {
    updateState(val);
    buildChartOptions();
  },
  { deep: true },
);
</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <BaseChart v-if="!errorMessage" :options="options" />
    <n-empty v-else :description="errorMessage" />
  </div>
</template>

<style lang="less" scoped>
</style>
