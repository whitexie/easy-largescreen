<script lang="ts" setup>
import { useMenus } from './useMenus';
import MenuItemVue from './MenuItem';
import type { MenuItem } from '@/types/dataLargeScreen';
import { useLargeScreenDesigner } from '@/stores/designer';

const designerStore = useLargeScreenDesigner();

const { MENUS: menus } = useMenus();

function handleClick(item: MenuItem) {
  designerStore.addWidget(item);
  console.log('handleClick item => ', item);
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
