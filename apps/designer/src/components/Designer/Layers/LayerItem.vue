<script lang="ts" setup>
import type { DataLargeScreenField } from '@/types/dataLargeScreen';

const props = defineProps<{
  item: DataLargeScreenField
  isExpand: boolean
  isSelected: boolean
}>();

const emits = defineEmits<{
  (e: 'click', data: { item: DataLargeScreenField, event: Event }): void
}>();

function getLockStateIcon(item: DataLargeScreenField) {
  return item.isLock ? 'i-solar:lock-linear' : 'i-solar:lock-broken';
}

function handleClickItem(event: Event) {
  const { item } = props;
  emits('click', { item, event });
}
</script>

<template>
  <div :class="{ selected: isSelected }" class="layer-item cursor-pointer flex justify-between items-center gap-2 p-2 select-none" @click="handleClickItem">
    <template v-if="!isExpand">
      <div :class="item.menuConfig.icon" class="m-auto block w-1.2em h-1.2em" />
    </template>
    <template v-else>
      <div class="flex items-center whitespace-nowrap">
        <div :class="item.menuConfig.icon" class="w-1.2em h-1.2em mr-1" />
        <div>{{ item.name }}</div>
      </div>
      <div class="flex gap-1 justify-end items-center">
        <div :class="getLockStateIcon(item)" class="w-1.2em h-1.2em cursor-pointer" @click.stop="item.isLock = !item.isLock" />
        <div class="cursor-move i-pepicons-pop:move-y w-1.2em h-1.2em" />
      </div>
    </template>
  </div>
</template>

<style scoped>
</style>
