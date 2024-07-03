<script lang="ts" setup>
import { nextTick } from 'vue';
import { useMenus } from './useMenus';
import MenuItemVue from './MenuItem';
import type { MenuItem } from '@/types/dataLargeScreen';
import { useLargeScreenDesigner } from '@/stores/designer';

const designerStore = useLargeScreenDesigner();

const { MENUS: menus } = useMenus();

async function handleClick(item: MenuItem) {
  const wgt = designerStore.addWidget(item);
  await nextTick();
  designerStore.setCurrentWidget(wgt.id);
}
</script>

<template>
  <div class="menu w-full h-full flex justify-center items-center gap-4">
    <div
      v-for="item in menus"
      :key="item.id"
    >
      <MenuItemVue :item="item" @click-menu="handleClick" />
    </div>
  </div>
</template>

<style scoped>
</style>
