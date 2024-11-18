<script lang="ts" name="Chart" setup>
import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import { loadAsyncComponent } from '@/utils/component';

defineProps<{
  widget: DataLargeScreenField
}>();

const ChartRender = loadAsyncComponent(() => import('@/components/Charts/ChartRender.vue'));
</script>

<template>
  <ChartRender :chart-config="widget.props.chartConfig" />
</template>

<style scoped>
</style>
