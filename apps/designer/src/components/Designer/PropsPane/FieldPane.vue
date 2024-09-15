<script lang="ts" setup>
import type { OriginalField } from '@/types/charts';
import { VueDraggable } from 'vue-draggable-plus';

interface Props {
  title: string
  type: 'metric' | 'dimension'
  fields: OriginalField[]
  dropGroup: string
}

const props = defineProps<Props>();

const cssVars = computed(() => {
  const result = {
    '--field-color': '',
  };

  if (props.type === 'dimension') {
    result['--field-color'] = '#4a90e2';
  }
  else { result['--field-color'] = '#40c0a8'; }

  return result;
});

const icon = computed(() => {
  return props.type === 'dimension' ? 'i-material-symbols:abc-rounded' : 'i-material-symbols:123-rounded';
});

function handleMove(event: any) {
  // 检查目标元素是否是 .empty
  if (event.related) {
    const targetEl = event.related as HTMLElement;
    if (targetEl.classList.contains('empty') && !event.willInsertAfter) {
      return true; // 允许移动
    }
  }

  // 阻止移动
  return false;
}
</script>

<template>
  <div class="field-pane text-xs h-full" :style="cssVars">
    <div class="px-2 h-36px flex justify-between items-center select-none">
      <span>
        {{ title }}
      </span>
    </div>
    <VueDraggable
      :model-value="fields"
      :group="{ name: dropGroup, pull: 'clone' }"
      :sort="false"
      class="field-list-container"
      @move="handleMove"
    >
      <div
        v-for="field in fields"
        :key="field.id"
        class="field-item px-2 h-28px flex items-center gap-1 select-none"
      >
        <div :class="icon" class="field-icon size-2em hover:color-white" />
        <span>
          {{ field.name }}
        </span>
      </div>
    </VueDraggable>
  </div>
</template>

<style lang="less" scoped>
.field-list-container {
  overflow-y: auto;
  height: calc(100% - 36px);
  // 美化滚动条
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
}
.field-pane {
  --field-color: #4a90e2;
  padding-bottom: 10px;

  .field-item:hover {
    background: var(--field-color);
    color: white;
    .field-icon {
      color: white;
    }
  }
  .field-icon {
    color: var(--field-color);
  }
}
</style>
