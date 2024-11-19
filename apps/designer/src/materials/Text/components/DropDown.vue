<script lang="ts" setup>
import type { NPopover } from 'naive-ui';
import { useTemplateRef } from 'vue';

interface OptionItem {
  value: string
  icon: string
}
interface Props {
  modelValue: string
  options: OptionItem[]
}
const props = defineProps<Props>();
const modelValue = defineModel('modelValue');
const popoverRef = useTemplateRef<typeof NPopover>('popoverRef');

const currentValueIcon = computed(() => {
  const item = props.options.find(item => item.value === modelValue.value);
  return item ? item.icon : props.options[0].icon;
});

function handleClick(item: OptionItem) {
  modelValue.value = item.value;
  popoverRef.value?.setShow(false);
}
</script>

<template>
  <div class="dropdown relative text-14px font-bold">
    <n-popover ref="popoverRef" trigger="click" :raw="true" placement="bottom">
      <template #trigger>
        <div :class="currentValueIcon" class="w-1em h-1em cursor-pointer color-black" />
      </template>
      <div class="flex items-center gap-1 bg-white shadow p-1">
        <div
          v-for="item in options" :key="item.value"
          class="wrap p-1 hover:(bg-#e0e0e0) flex justify-center items-center"
        >
          <div
            :class="item.icon" class="w-1em h-1em text-16px cursor-pointer color-black "
            @click="handleClick(item)"
          />
        </div>
      </div>
    </n-popover>
  </div>
</template>
