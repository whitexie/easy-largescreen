<script lang="ts" setup>
import Layers from '@/components/Designer/Layers/index.vue';
import Pane from '@/components/Designer/PropsPane/Pane.vue';
import Menus from '@/components/Designer/Menus/Menus.vue';
import { useSpacebarDraggable } from '@/composables/useSpacebarDraggable';
import { useLargeScreenDesigner } from '@/stores/designer';

const designerStore = useLargeScreenDesigner();
const width = computed({
  get() {
    return designerStore.state.pageConfig.width;
  },
  set(val: number) {
    designerStore.state.pageConfig.width = val;
  },
});
const height = computed({
  get() {
    return designerStore.state.pageConfig.height;
  },
  set(val: number) {
    designerStore.state.pageConfig.height = val;
  },
});
const scale = computed({
  get() {
    return designerStore.temporaryState.scale;
  },
  set(val: number) {
    designerStore.temporaryState.scale = val;
  },
});

const { canvasRef, offsetStyle, cursorStyle, handleMouseDown, setOffset } = useSpacebarDraggable();

const canvasStyle = computed(() => {
  return {
    width: `${width.value}px`,
    height: `${height.value}px`,
    cursor: cursorStyle.value,
    ...offsetStyle.value,
    transform: `scale(${scale.value / 100})`,
  };
});

function formatTooltip(v: number) {
  return `${v}%`;
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

function hadnleBestFitScale() {
  if (!canvasRef.value)
    return;

  const margin = 30;
  const containerElement = canvasRef.value.parentElement as HTMLElement;
  const canvasElement = canvasRef.value;

  scale.value = calculateBestFitScale(containerElement, canvasElement, margin);
  const { offsetHeight } = canvasElement;
  const { offsetHeight: containerHeight } = containerElement;

  const y = (containerHeight - offsetHeight * scale.value / 100) / 2;

  setOffset({ x: margin, y });
}
</script>

<template>
  <div class="px-2">
    <div class="border-b-1px gap-2 flex items-center justify-between border-gray-200 border-b-solid h-50px">
      <div class="left">
        <n-input placeholder="大屏名称" class="w-160px!" />
      </div>
      <div class="center flex-1 h-full">
        <Menus />
      </div>
      <div class="right">
        <div class="flex items-center gap-2">
          <n-button>预览</n-button>
          <n-button type="primary">
            保存
          </n-button>
        </div>
      </div>
    </div>
  </div>
  <main class="h-calc[100%-50px] w-full relative grid grid-cols-3 canvas-warpper bg-#f2f2f2">
    <Layers />
    <div class="relative">
      <div class="bg-#f2f2f2 overflow-auto relative w-full flex-1 p-7.5  h-calc[100%-36px]">
        <div ref="canvasRef" class="canvas absolute bg-white transform-origin-top-left " :style="canvasStyle" @mousedown="handleMouseDown" />
      </div>
      <div class="flex justify-between absolute bottom-0 right-0 w-full h-36px bg-white px-3">
        <div />
        <div class="right flex h-full">
          <n-tooltip placement="top" trigger="hover" :delay="300">
            <template #trigger>
              <div class="self-center text-xs cursor-pointer">
                {{ scale }}%
              </div>
            </template>
            <span class="text-xs">缩放比例</span>
          </n-tooltip>

          <n-divider vertical style="height: 100%" />

          <n-slider v-model:value="scale" :min="10" :max="500" :step="1" :marks="{ 100: '' }" :format-tooltip="formatTooltip" class="bg-white" style="width: 160px;" />
          <n-divider vertical style="height: 100%" />
          <n-tooltip placement="top" trigger="hover" :delay="300">
            <template #trigger>
              <div class="i-fluent:text-align-distributed-20-regular size-1.5em cursor-pointer self-center" @click="hadnleBestFitScale" />
            </template>
            <span class="text-xs">自适应宽度</span>
          </n-tooltip>
        </div>
      </div>
    </div>
    <Pane />
  </main>
</template>

<style scoped>
.canvas-warpper {
  display: grid;
  gap: 1px;
  grid-template-columns: max-content 1fr max-content;
}
.canvas {
  --line-color: rgba(60, 10, 30, 0.2);
  background-image: linear-gradient(90deg, var(--line-color) 3%, transparent 0),
    linear-gradient(1turn, var(--line-color) 3%, transparent 0);
  background-size: 20px 20px;
}
</style>
