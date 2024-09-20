<script setup lang="ts">
import type { ChartRenderState } from '@/types/charts';
import { toRaw } from 'vue';
import BaseChart from './BaseChart.vue';

interface Props {
  chartConfig: ChartRenderState
  data?: Record<string, string | number>[]
}

const props = withDefaults(
  defineProps<Props>(),
  { data: () => [] },
);
const options = ref<Record<string, any>>({});

function buildChartOptions() {
  const _options = {
    type: 'interval',
    data: toRaw(props.data),
    encode: {
      x: props.chartConfig.dropBoxSettings.xAxis.fields[0].id,
      y: props.chartConfig.dropBoxSettings.yAxis.fields[0].id,
    },
    axis: {
      x: {
        title: props.chartConfig.dropBoxSettings.xAxis.fields[0].name,
      },
      y: {
        title: props.chartConfig.dropBoxSettings.yAxis.fields[0].name,
      },
    },
    tooltip: {
      items: [
        {
          name: props.chartConfig.dropBoxSettings.yAxis.fields[0].name,
          field: props.chartConfig.dropBoxSettings.yAxis.fields[0].id,
        },
      ],
    },
  };

  // console.log('_options => ', _options);
  options.value = _options;
}

watch(
  () => ({ config: props.chartConfig, data: props.data }),
  () => {
    // console.log('buildChartOptions');
    buildChartOptions();
  },
  {
    deep: true,
  },
);
</script>

<template>
  <div class="w-full h-full">
    <BaseChart :options="options" />
  </div>
</template>

<style lang="less" scoped>
</style>
