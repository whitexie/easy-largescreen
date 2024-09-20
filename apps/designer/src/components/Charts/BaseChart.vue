<script setup lang="ts">
import { useAttrs } from 'vue';
import { useChart } from './composables/useChart';

const { options } = defineProps<{ options: Record<string, any> }>();
const attrs = useAttrs();

const { containerElement, render } = useChart(options, attrs);

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
  <div ref="containerElement" class="w-full h-full" />
</template>

<style>
</style>
