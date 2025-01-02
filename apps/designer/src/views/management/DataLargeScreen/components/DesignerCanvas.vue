<script lang="ts" setup>
import type { AddWidgetOption, MenuItem } from '@/types/dataLargeScreen';
import { useCanvasMove } from '@/composables/useCanvasMove';
import { useMenus } from '@/materials/base/menus';
import { useLargeScreenDesigner } from '@/stores/designer';
import { onKeyStroke } from '@vueuse/core';
import { omit } from 'lodash-es';
import { storeToRefs } from 'pinia';
import ContextMenu from './ContextMenu';

const mouseEnter = ref(false);
const designerStore = useLargeScreenDesigner();
const { getMenuConfig } = useMenus();

const { canvasRef } = storeToRefs(designerStore);

// 画布拖拽
const { offsetStyle, cursorStyle, handleMouseDown, spacePressed } = useCanvasMove(canvasRef);

const canvasStyle = computed(() => {
  const { canvasBackgroundStyle, canvasStyle, scale } = designerStore;

  return {
    ...canvasBackgroundStyle,
    ...canvasStyle,
    cursor: cursorStyle.value,
    ...offsetStyle.value,
    transform: `scale(${scale / 100})`,
  };
});
const canvasMaskStyle = computed(() => {
  return omit(canvasStyle.value, ['backgroundColor', 'backgroundImage']);
});

const contextMenuOptions = computed(() => {
  const wgts = designerStore.selectedWidgets;

  const isAllLocked = wgts.every(wgt => wgt.isLock);

  return [
    {
      label: '创建编组',
      key: 'createGroup',
      keys: ['Ctrl', 'G'],
      // TODO: 选中的物料是否为编组
      disabled: wgts.length < 1,
    },
    {
      label: '解除编组',
      key: 'unlockGroup',
      keys: ['Ctrl', 'G'],
      // TODO: 是否为编组
    },
    {
      label: '删除',
      key: 'delete',
      keys: ['Backspace'],
    },
    {
      label: '锁定',
      key: 'lock',
      keys: ['Ctrl', 'L'],
      disabled: isAllLocked,
    },
    {
      label: '解锁',
      key: 'unlock',
      keys: ['Ctrl', 'Shift', 'L'],
      disabled: !isAllLocked,
    },
  ];
});

function handleContextMenuSelect(key: string) {
  switch (key) {
    case 'delete': {
      designerStore.removeSelectedWidgets();
      break;
    }
    case 'lock': {
      designerStore.lockSelectedWidgets();
      break;
    }
    case 'unlock': {
      designerStore.unlockSelectedWidgets();
      break;
    }
    // TODO: 其他功能...
    default: {
      console.error(key);
    }
  }
}

function handleClickCanvas() {
  designerStore.setCurrentWidget(null);
}

function handleDragOver(e: DragEvent) {
  e.preventDefault();
}

function handleDrop(e: DragEvent) {
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

function handleDeleteWidget() {
  if (mouseEnter.value) {
    designerStore.removeSelectedWidgets();
  }
}

onKeyStroke('Backspace', handleDeleteWidget);
</script>

<template>
  <ContextMenu :options="contextMenuOptions" @select="handleContextMenuSelect">
    <div
      ref="canvasRef"
      class="large-screen-canvas absolute bg-white transform-origin-top-left "
      :style="canvasStyle"
      @click.stop="handleClickCanvas"
      @dragover="handleDragOver"
      @drop="handleDrop"
      @mouseenter="mouseEnter = true"
      @mouseleave="mouseEnter = false"
    >
      <slot />
    </div>
    <div
      v-show="spacePressed"
      class="absolute transform-origin-top-left"
      :style="canvasMaskStyle"
      @mousedown.stop="handleMouseDown"
    />
  </ContextMenu>
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
  /* 确保不干扰其他事件 */
  pointer-events: none;
  background-color: rgba(52, 152, 251, 0.24);
  border: 1px solid #103ffa50;
}
</style>
