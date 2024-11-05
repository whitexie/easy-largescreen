<script lang="ts" setup>
import type { MenuItem } from '@/types/dataLargeScreen';
import { useLargeScreenDesigner } from '@/stores/designer';
import { nextTick } from 'vue';
import MenuItemVue from './MenuItem';
import { useMenus } from './useMenus';

const designerStore = useLargeScreenDesigner();

const { MENUS: menus, getMenuConfig } = useMenus();

const dragPlaceholderElement = ref<HTMLElement | null>(null);

const placeholderElementSize = reactive({ width: 200, height: 50 });

const placeholderElementStyle = computed(() => {
  return {
    width: `${placeholderElementSize.width}px`,
    height: `${placeholderElementSize.height}px`,
  };
});

async function handleClick(item: MenuItem) {
  const wgt = designerStore.addWidget(item);
  await nextTick();
  designerStore.setCurrentWidget(wgt.id);
}

function handleDragStart(e: DragEvent, item: MenuItem) {
  const config = getMenuConfig(item.id);
  const { width = 100, height = 50 } = config.size;
  placeholderElementSize.width = width;
  placeholderElementSize.height = height;
  e.dataTransfer?.setData('text/plain', JSON.stringify(item));
  e.dataTransfer?.setDragImage(dragPlaceholderElement.value!, width / 2, height / 2);
}
</script>

<template>
  <div class="w-full h-full flex justify-center items-center gap-4">
    <div v-for="item in menus" :key="item.id">
      <MenuItemVue :item="item" @click-menu="handleClick" @dragstart="handleDragStart" />
    </div>
  </div>
  <!-- 拖拽时的占位元素 -->
  <div
    ref="dragPlaceholderElement" class="absolute left--999 top--9999 bg-blue-500 w-25 h-7.5"
    :style="placeholderElementStyle"
  />
</template>

<style scoped></style>
