<script setup lang="ts">
import { useAttrs } from 'vue';
import { useChart } from './composables/useChart';

const { options } = defineProps<{ options: any }>();
const attrs = useAttrs();

const { containerElement, render } = useChart(options, attrs);

watch(() => options, (val) => {
  render(val);
});
</script>

<template>
  <div ref="containerElement" class="w-full h-full" />
</template>

<style>
</style>
