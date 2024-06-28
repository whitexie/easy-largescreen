<script lang="ts" setup>
import { useLargeScreenDesigner } from '@/stores/designer';

const props = defineProps<{
  canvasRef: HTMLElement | null
  setOffset: (_offset: {
    x?: number | undefined
    y?: number | undefined
  }) => void
}>();

const designerStore = useLargeScreenDesigner();

function hadnleBestFitScale() {
  if (!props.canvasRef) return;

  const margin = 30;
  const containerElement = props.canvasRef.parentElement as HTMLElement;
  const canvasElement = props.canvasRef;

  designerStore.temporaryState.scale = calculateBestFitScale(containerElement, canvasElement, margin);
  const { offsetHeight } = canvasElement;
  const { offsetHeight: containerHeight } = containerElement;

  const y = (containerHeight - offsetHeight * designerStore.temporaryState.scale / 100) / 2;

  props.setOffset({ x: margin, y });
}

function calculateBestFitScale(containerElement: HTMLElement, canvasElement: HTMLElement, margin: number = 0) {
  // 获取容器和画布的宽度和高度
  const containerWidth = containerElement.offsetWidth;
  const containerHeight = containerElement.offsetHeight;
  const canvasWidth = canvasElement.offsetWidth;
  const canvasHeight = canvasElement.offsetHeight;

  // 计算容器和画布的宽度和高度比例
  const widthScale = (containerWidth - margin * 2) / canvasWidth;
  const heightScale = (containerHeight - margin * 2) / canvasHeight;

  return Math.round(Math.min(widthScale, heightScale) * 100);
}

function formatTooltip(v: number) {
  return `${v}%`;
}
</script>

<template>
  <div class="flex justify-between absolute bottom-0 right-0 w-full h-36px bg-white px-3">
    <div />
    <div class="right flex h-full">
      <n-tooltip placement="top" trigger="hover" :delay="300">
        <template #trigger>
          <div class="self-center text-xs cursor-pointer">
            {{ designerStore.temporaryState.scale }}%
          </div>
        </template>
        <span class="text-xs">缩放比例</span>
      </n-tooltip>

      <n-divider vertical style="height: 100%" />

      <n-slider v-model:value="designerStore.temporaryState.scale" :min="10" :max="500" :step="1" :marks="{ 100: '' }" :format-tooltip="formatTooltip" class="bg-white" style="width: 160px;" />
      <n-divider vertical style="height: 100%" />
      <n-tooltip placement="top" trigger="hover" :delay="300">
        <template #trigger>
          <div class="i-fluent:text-align-distributed-20-regular size-1.5em cursor-pointer self-center" @click="hadnleBestFitScale" />
        </template>
        <span class="text-xs">自适应宽度</span>
      </n-tooltip>
    </div>
  </div>
</template>

<style scoped>
</style>
