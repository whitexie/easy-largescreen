<script setup lang="ts">
import type { Field } from '@/types/charts';

const props = defineProps<{
  field: Field
}>();

const emits = defineEmits<{
  (e: 'command', command: string, data: Field): void
}>();

const fieldBgColor = computed(() => {
  return props.field.fieldType === 'dimension' ? 'bg-#4a90e2' : 'bg-#40c0a8';
});

const dropDownOptions = [
  {
    label: '删除',
    key: 'delete',
  },
];

function handleSelect(command: string) {
  emits('command', command, props.field);
}
</script>

<template>
  <div :class="[fieldBgColor]" class="field-item w-full flex items-center justify-between h-20px px-3 rounded-20px text-white">
    <div>
      {{ field.name }}
    </div>
    <n-dropdown :options="dropDownOptions" trigger="click" size="small" :show-arrow="true" @select="handleSelect">
      <div class="arrow-down">
        <!--  -->
      </div>
    </n-dropdown>
  </div>
</template>

<style lang="less" scoped>
.field-item {
  display: flex;
  align-items: center;
  cursor: move;

  .arrow-down {
    display: none;
    width: 1.2em;
    height: 1em;
    clip-path: polygon(10% 10%, 100% 10%, 50% 90%);
    background-color: #fff;
    cursor: pointer;
  }

  &:not(:first-child) {
    margin-top: 5px;
  }

  &:hover {
    :deep(.arrow-down) {
      display: block;
    }
  }
}
</style>
