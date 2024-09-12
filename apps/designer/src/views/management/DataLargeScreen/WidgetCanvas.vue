<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import DragDistanceIndicator from './DragDistanceIndicator.vue';
import { useDraggable } from './useDraggable';
import DesignerWidget from './DesignerWidget.vue';
import { useSpacebarDraggable } from '@/composables/useSpacebarDraggable';
import { useLargeScreenDesigner } from '@/stores/designer';
import type { AddWidgetOption, DataLargeScreenField, MenuItem } from '@/types/dataLargeScreen';
import { useMenus } from '@/components/Designer/Menus/useMenus';

const designerStore = useLargeScreenDesigner();

const { getMenuConfig } = useMenus();
const { canvasRef, offsetStyle, cursorStyle, handleMouseDown } = useSpacebarDraggable(storeToRefs(designerStore).canvasRef);

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
const draggableOption = computed(() => {
  const { temporaryState: { scale } } = designerStore;
  return {
    scale: scale / 100,
  };
});

const { handleMouseDown: handleDragEvent, initPosition, position, isDragging } = useDraggable(draggableOption);

watch(
  position.value,
  val => designerStore.updateCurrentWidgetLocation(val),
);

function handleClickWidget(widget: DataLargeScreenField) {
  designerStore.setCurrentWidget(widget.id);
}

function handleWidgetMouseDown(event: MouseEvent, widget: DataLargeScreenField) {
  designerStore.setCurrentWidget(widget.id);
  const { location: [x, y] } = widget;
  initPosition({ x, y });
  handleDragEvent(event);
}

function handleClickCanvas() {
  designerStore.setCurrentWidget('');
}

function handleDragOver(e: DragEvent) {
  // console.log('[handleDragEnter] => ', e);
  e.preventDefault();
}

function handleDrop(e: DragEvent) {
  // console.log('[handleDrop] => ', e);
  // console.log('[dataTransfer.getData] =>', e.dataTransfer?.getData('text/plain'));
  const menuItem = JSON.parse(e.dataTransfer?.getData('text/plain') || '{}') as MenuItem;
  const widgetConfig = getMenuConfig(menuItem.id);

  const { layerX, layerY } = e;
  const x = layerX - widgetConfig.size[0] / 2;
  const y = layerY - widgetConfig.size[1] / 2;

  const option: AddWidgetOption = {
    location: [x, y],
    size: [...widgetConfig.size],
  };

  const widget = designerStore.addWidget(menuItem, option);

  designerStore.setCurrentWidget(widget.id);
}
</script>

<template>
  <div
    ref="canvasRef" class="large-screen-canvas absolute bg-white transform-origin-top-left " :style="canvasStyle"
    @click.stop="handleClickCanvas" @mousedown="handleMouseDown" @dragover="handleDragOver" @drop="handleDrop"
  >
    <template v-for="item in designerStore.widgets" :key="item.id">
      <DesignerWidget :widget="item" @mousedown="handleWidgetMouseDown" @click-widget="handleClickWidget" />
    </template>
    <DragDistanceIndicator :widget="designerStore.currentWidget" :is-dragging="isDragging" />
  </div>
</template>

<style scoped></style>
