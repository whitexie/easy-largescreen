<script lang="ts" setup>
import type { MenuItem } from '@/types/dataLargeScreen';
import { useSharedMaterialDragAdd } from '@/composables/useMaterialDragAdd';
import { MENUS as menus } from '@/materials/base/menus';
import { useLargeScreenDesigner } from '@/stores/designer';
import { nextTick } from 'vue';
import MenuItemVue from './MenuItem';

const designerStore = useLargeScreenDesigner();

const { startDrag, dragPlaceholderElement, placeholderElementSize } = useSharedMaterialDragAdd();

const placeholderElementStyle = computed(() => {
  return {
    width: `${placeholderElementSize.width}px`,
    height: `${placeholderElementSize.height}px`,
  };
});

async function handleClick(item: MenuItem) {
  const wgt = designerStore.addWidget(item);
  await nextTick();
  designerStore.setCurrentWidget(wgt);
}
</script>

<template>
  <div class="w-full h-full flex justify-center items-center gap-4">
    <div v-for="item in menus" :key="item.id">
      <MenuItemVue :item="item" @click-menu="handleClick" @dragstart="startDrag" />
    </div>
  </div>
  <!-- 拖拽时的占位元素 -->
  <div
    ref="dragPlaceholderElement" class="absolute left--999 top--9999 bg-blue-500 w-25 h-7.5"
    :style="placeholderElementStyle"
  />
</template>
