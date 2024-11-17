<script lang="ts" setup>
import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import ChartRender from '@/components/Charts/ChartRender.vue';

defineProps<{
  widget: DataLargeScreenField
}>();
</script>

<template>
  <ChartRender :chart-config="widget.props.chartConfig" />
</template>

<style scoped>
</style>
