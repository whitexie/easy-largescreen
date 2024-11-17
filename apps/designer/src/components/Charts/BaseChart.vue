<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import { useAttrs } from 'vue';
import { useChart } from './composables/useChart';

const { options } = defineProps<{ options: Record<string, any> }>();
const attrs = useAttrs();

const { containerElement, render, forceFit } = useChart(options, attrs);
const size = useElementSize(containerElement);

watch(
  () => size,
  () => forceFit(),
  { deep: true },
);

watch(
  () => options,
  (val) => {
    if (typeof val === 'object' && val !== null) {
      render(val);
    }
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <div ref="containerElement" class="base-chart w-full h-full" />
</template>

<style>
</style>
