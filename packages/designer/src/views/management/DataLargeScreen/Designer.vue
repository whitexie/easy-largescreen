<script lang="ts" setup>
import DesignerWidget from './DesignerWidget.vue';
import Footer from './Footer.vue';
import DesignerHeader from './DesignerHeader.vue';
import DragDistanceIndicator from './DragDistanceIndicator.vue';
import { useDraggable } from './useDraggable';
import Layers from '@/components/Designer/Layers/index.vue';
import Pane from '@/components/Designer/PropsPane/Pane.vue';
import { useSpacebarDraggable } from '@/composables/useSpacebarDraggable';
import { useLargeScreenDesigner } from '@/stores/designer';
import type { DataLargeScreenField } from '@/types/dataLargeScreen';

const designerStore = useLargeScreenDesigner();
const { canvasRef, offsetStyle, cursorStyle, handleMouseDown, setOffset } = useSpacebarDraggable();

const draggableOption = computed(() => {
  const { temporaryState: { scale } } = designerStore;
  return {
    scale: scale / 100,
  };
});

const { handleMouseDown: handleDragEvent, initPosition, position, isDragging } = useDraggable(draggableOption);
const dragWidget = ref<DataLargeScreenField | null>(null);
const canvasStyle = computed(() => {
  const { pageConfig: { width, height } } = designerStore.state;
  const { scale } = designerStore.temporaryState;
  return {
    width: `${width}px`,
    height: `${height}px`,
    cursor: cursorStyle.value,
    ...offsetStyle.value,
    transform: `scale(${scale / 100})`,
  };
});

function handleClickCanvas() {
  designerStore.setCurrentWidget('');
}

function handleClickWidget(widget: DataLargeScreenField) {
  designerStore.setCurrentWidget(widget.id);
}

function handleWidgetMouseDown(event: MouseEvent, widget: DataLargeScreenField) {
  designerStore.setCurrentWidget(widget.id);
  const { location: [x, y] } = widget;
  initPosition({ x, y });
  dragWidget.value = widget;
  handleDragEvent(event);
}

watch(
  position.value,
  (val) => {
    if (!dragWidget.value) {
      return;
    }
    const { x, y } = val;
    dragWidget.value.location[0] = x;
    dragWidget.value.location[1] = y;
  },
);

watch(
  () => isDragging.value,
  (val) => {
    if (val && dragWidget.value?._el) {
      console.log('current drag widget => ', dragWidget.value._el);
    }
  },
);
</script>

<template>
  <DesignerHeader />
  <main class="h-calc[100%-50px] w-full relative grid grid-cols-3 canvas-warpper bg-#f2f2f2">
    <Layers />
    <div class="relative">
      <div class="bg-#f2f2f2 overflow-auto relative w-full flex-1 p-7.5  h-calc[100%-36px]">
        <div ref="canvasRef" class="canvas absolute bg-white transform-origin-top-left " :style="canvasStyle" @click.stop="handleClickCanvas" @mousedown="handleMouseDown">
          <template v-for="item in designerStore.widgets" :key="item.id">
            <DesignerWidget :widget="item" @mousedown="handleWidgetMouseDown" @click-widget="handleClickWidget" />
          </template>
          <DragDistanceIndicator :canvas-ref="canvasRef" :widget="dragWidget" :is-dragging="isDragging" />
        </div>
      </div>
      <Footer :canvas-ref="canvasRef" :set-offset="setOffset" />
    </div>
    <Pane />
  </main>
</template>

<style lang="less" scoped>
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
