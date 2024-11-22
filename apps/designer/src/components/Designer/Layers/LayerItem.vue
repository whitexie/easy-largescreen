<script lang="ts" setup>
import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import { Icon } from '@iconify/vue/dist/iconify.js';

const props = defineProps<{
  item: DataLargeScreenField
  isExpand: boolean
  isSelected: boolean
}>();

const emits = defineEmits<{
  (e: 'click', data: { item: DataLargeScreenField, event: Event }): void
}>();

function getLockStateIcon(item: DataLargeScreenField) {
  return item.isLock ? 'solar:lock-linear' : 'solar:lock-broken';
}

function handleClickItem(event: Event) {
  const { item } = props;
  emits('click', { item, event });
}
</script>

<template>
  <div :class="{ selected: isSelected }" class="layer-item cursor-pointer flex justify-between items-center gap-2 p-2 select-none" @click="handleClickItem">
    <template v-if="!isExpand">
      <Icon :icon="item.menuConfig.icon" style="width: 1.2em; height: 1.2em" class="m-auto block" />
    </template>
    <template v-else>
      <div class="flex items-center whitespace-nowrap">
        <Icon :icon="item.menuConfig.icon" style="width: 1.2em; height: 1.2em" />
        <div>{{ item.name }}</div>
      </div>
      <div class="flex gap-1 justify-end items-center">
        <Icon :icon="getLockStateIcon(item)" style="width: 1.2em; height: 1.2em; cursor: pointer;" @click="item.isLock = !item.isLock" />
        <Icon class="cursor-move" icon="pepicons-pop:move-y" style="width: 1.2em; height: 1.2em" />
      </div>
    </template>
  </div>
</template>

<style scoped>
</style>
