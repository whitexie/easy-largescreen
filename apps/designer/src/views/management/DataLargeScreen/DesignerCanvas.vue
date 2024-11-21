<script lang="ts" setup>
import type { AddWidgetOption, DataLargeScreenField, MenuItem } from '@/types/dataLargeScreen';
import { useMenus } from '@/components/Designer/Menus/useMenus';
import { useSpaceDraggable } from '@/composables/useSpaceDraggable';
import { useLargeScreenDesigner } from '@/stores/designer';
import { omit } from 'lodash-es';
import { storeToRefs } from 'pinia';
import DesignerWidget from './DesignerWidget.vue';
import DragDistanceIndicator from './DragDistanceIndicator.vue';
import { useDraggable } from './useDraggable';
import { useWidgetResize } from './useWidgetResize';

const designerStore = useLargeScreenDesigner();
const { getMenuConfig } = useMenus();

// 画布拖拽
const { canvasRef } = storeToRefs(designerStore);
const { offsetStyle, cursorStyle, handleMouseDown, spacePressed } = useSpaceDraggable(canvasRef);

// 组件缩放
const { handleActiveResize, isResizing } = useWidgetResize();

// 组件移动
const draggableOption = computed(() => ({ scale: designerStore.scale / 100 }));
const { handleMouseDown: startMove, initPosition, position, isDragging } = useDraggable(draggableOption);

const canvasStyle = computed(() => {
  const { canvasBackgroundStyle, canvasStyle } = designerStore;
  const { scale } = designerStore;
  return {
    ...canvasBackgroundStyle,
    ...canvasStyle,
    cursor: cursorStyle.value,
    ...offsetStyle.value,
    transform: `scale(${scale / 100})`,
  };
});
const canvasMaskStyle = computed(() => {
  return {
    ...omit(canvasStyle.value, ['cursor', 'backgroundColor', 'backgroundImage']),
    cursor: 'move',
  };
});

watch(
  position.value,
  val => designerStore.updateCurrentWidgetLocation(val),
);

function handleClickWidget(widget: DataLargeScreenField) {
  if (!spacePressed.value) {
    designerStore.setCurrentWidget(widget);
  }
}

function handleWidgetMouseDown(event: MouseEvent, widget: DataLargeScreenField) {
  if (spacePressed.value || designerStore.currentWidget?.isLock) {
    return;
  }
  designerStore.setCurrentWidget(widget);
  const { location } = widget;
  initPosition(location);
  startMove(event);
}

function handleClickCanvas() {
  if (isDragging.value || isResizing.value) {
    return;
  }
  designerStore.setCurrentWidget(null);
}

function handleDragOver(e: DragEvent) {
  e.preventDefault();
}

function handleResize(horizontal: -1 | 0 | 1, vertical: -1 | 0 | 1) {
  const scale = designerStore.scale / 100;
  handleActiveResize(designerStore.currentWidget!, canvasRef.value, horizontal, vertical, scale);
}

function handleDrop(e: DragEvent) {
  if (isDragging.value) {
    return;
  }
  if (!canvasRef.value?.contains(e.target as Node)) {
    return;
  }

  const menuItem = JSON.parse(e.dataTransfer?.getData('text/plain') || '{}') as MenuItem;
  const widgetConfig = getMenuConfig(menuItem.id);

  const canvasRect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - canvasRect.left;
  const y = e.clientY - canvasRect.top;

  const scale = designerStore.scale / 100;
  const width = widgetConfig.size.width / scale;
  const height = widgetConfig.size.height / scale;

  const option: AddWidgetOption = {
    location: {
      x: x / scale - width / 2,
      y: y / scale - height / 2,
    },
    size: { width, height },
  };

  const widget = designerStore.addWidget(menuItem, option);
  designerStore.setCurrentWidget(widget);
}
</script>

<template>
  <div
    ref="canvasRef"
    class="large-screen-canvas absolute bg-white transform-origin-top-left "
    :style="canvasStyle"
    @click.stop="handleClickCanvas"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <template v-for="item in designerStore.widgets" :key="item.id">
      <DesignerWidget :widget="item" @mousedown.stop="handleWidgetMouseDown" @click-widget="handleClickWidget" @resize="handleResize" />
    </template>
    <DragDistanceIndicator :widget="designerStore.currentWidget" :is-dragging="isDragging" />
  </div>
  <div v-show="spacePressed" class="mask absolute transform-origin-top-left" :style="canvasMaskStyle" @mousedown.stop="handleMouseDown" />
</template>

<style scoped>
.large-screen-canvas {
  --grid-size: 20px;
  --line-color: rgba(60, 10, 30, 0.2);
  background-image: linear-gradient(90deg, var(--line-color) 3%, transparent 0),
    linear-gradient(1turn, var(--line-color) 3%, transparent 0);
  background-size: var(--grid-size) var(--grid-size);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 2px 4px 0px;
}

.brush-area {
  pointer-events: none; /* 确保不干扰其他事件 */
  background-color: rgba(52, 152, 251, 0.24);
  border: 1px solid #103ffa50;
}
</style>
