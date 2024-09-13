<script setup lang="ts">
import { type DraggableEvent, type SortableEvent, VueDraggable } from 'vue-draggable-plus';
import DropFieldItem from './DropFieldItem.vue';
import type { Field, OriginalField } from '@/types/charts';

const props = defineProps<{
  title: string
  type: 'dimension' | 'metric'
  fields: Field[]
  dropGroup: string
  hiddenEmpty?: boolean
}>();

const emits = defineEmits<{
  (event: 'add', data: { field: OriginalField, index: number }): void
  (event: 'delete', data: Field): void
}>();

const fields = defineModel<Field[]>('fields', { required: true, default: [] });

function handleAdd(event: SortableEvent) {
  const e = event as DraggableEvent<OriginalField>;
  if (!e.data) {
    return;
  }

  event.preventDefault();
  emits('add', { field: e.data, index: e.newIndex || props.fields.length });
}

function handleCommand(command: string, data: Field) {
  if (command === 'delete') {
    emits('delete', data);
  }
}
</script>

<template>
  <div class="input-field-box text-12px select-none">
    <div class="input-field-box-header  pl-2 line-height-18px">
      {{ title }}
    </div>
    <VueDraggable :model-value="fields" :group="{ name: dropGroup, pull: true }" filter=".empty" :sort="false" class="drop-area p-1 m-1 rounded border-dashed border-gray-200" @add="handleAdd">
      <template v-for="field in fields" :key="field.id">
        <DropFieldItem :field="field" @command="handleCommand" />
      </template>
      <div v-if="!hiddenEmpty" class="empty mx-auto my-1 h-30px flex items-center justify-center rounded-30px border-dashed border-gray-200">
        拖入字段
      </div>
    </VueDraggable>
  </div>
</template>

<style lang="less" scoped>
.input-field-box {
  &:not(:first-child) {
    margin-top: 8px;
  }
}
</style>
