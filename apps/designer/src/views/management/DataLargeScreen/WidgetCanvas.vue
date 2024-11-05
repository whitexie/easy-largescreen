<script lang="ts" setup>
import type { AddWidgetOption, DataLargeScreenField, MenuItem } from '@/types/dataLargeScreen';
import { useMenus } from '@/components/Designer/Menus/useMenus';
import { useSpaceDraggable } from '@/composables/useSpaceDraggable';
import { useLargeScreenDesigner } from '@/stores/designer';
import { storeToRefs } from 'pinia';
import DesignerWidget from './DesignerWidget.vue';
import DragDistanceIndicator from './DragDistanceIndicator.vue';
import { useDraggable } from './useDraggable';

const designerStore = useLargeScreenDesigner();

const { getMenuConfig } = useMenus();
const { canvasRef, offsetStyle, cursorStyle, handleMouseDown } = useSpaceDraggable(storeToRefs(designerStore).canvasRef);

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
  const { location } = widget;
  initPosition(location);
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
  const menuItem = JSON.parse(e.dataTransfer?.getData('text/plain') || '{}') as MenuItem;
  const widgetConfig = getMenuConfig(menuItem.id);

  const { offsetY, offsetX } = e;
  const scale = designerStore.temporaryState.scale / 100;
  const width = widgetConfig.size.width / scale;
  const height = widgetConfig.size.height / scale;
  const x = offsetX - width / 2;
  const y = offsetY - height / 2;

  const option: AddWidgetOption = {
    location: { x, y },
    size: { width, height },
  };

  const widget = designerStore.addWidget(menuItem, option);

  designerStore.setCurrentWidget(widget.id);
}
</script>

<template>
  <div
    ref="canvasRef"
    class="large-screen-canvas absolute bg-white transform-origin-top-left "
    :style="canvasStyle"
    @click.stop="handleClickCanvas" @mousedown="handleMouseDown" @dragover="handleDragOver" @drop="handleDrop"
  >
    <template v-for="item in designerStore.widgets" :key="item.id">
      <DesignerWidget :widget="item" @mousedown="handleWidgetMouseDown" @click-widget="handleClickWidget" />
    </template>
    <DragDistanceIndicator :widget="designerStore.currentWidget" :is-dragging="isDragging" />
  </div>
</template>

<style scoped></style>
