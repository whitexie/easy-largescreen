<script lang="ts" setup>
import { useLargeScreenDesigner } from '@/stores/designer';

const designerStore = useLargeScreenDesigner();

const scaleOptions = [50, 100, 150, 200].map(key => ({ key, label: `${key}%` }));

function formatTooltip(v: number) {
  return `${v}%`;
}

function onSelectScale(key: number) {
  designerStore.temporaryState.scale = key;
}
</script>

<template>
  <div class="flex justify-between absolute bottom-0 right-0 w-full h-36px bg-white px-3">
    <div />
    <div class="right flex h-full">
      <n-dropdown trigger="click" placement="top" size="small" :options="scaleOptions" @select="onSelectScale">
        <div class="self-center text-xs cursor-pointer">
          {{ designerStore.temporaryState.scale }}%
        </div>
      </n-dropdown>

      <n-divider vertical style="height: 100%" />

      <n-slider v-model:value="designerStore.temporaryState.scale" :min="10" :max="500" :step="1" :marks="{ 100: '' }" :format-tooltip="formatTooltip" class="bg-white" style="width: 160px;" />
      <n-divider vertical style="height: 100%" />
      <n-tooltip placement="top" trigger="hover" :delay="300">
        <template #trigger>
          <div class="i-fluent:text-align-distributed-20-regular size-1.5em cursor-pointer self-center" @click="designerStore.handleBestFitScale" />
        </template>
        <span class="text-xs">自适应宽度</span>
      </n-tooltip>
    </div>
  </div>
</template>

<style scoped>
</style>
