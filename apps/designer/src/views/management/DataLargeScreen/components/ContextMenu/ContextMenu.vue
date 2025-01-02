<script setup lang="tsx">
import { type DropdownOption, NDropdown } from 'naive-ui';
import { nextTick, ref } from 'vue';

defineProps<{
  options: {
    label: string
    key: string
    children?: {
      label: string
      key: string
    }[]
  }[]
}>();

const emit = defineEmits<{
  (e: 'select', key: string): void
}>();

const showDropdown = ref(false);
const dropdownPosition = reactive({
  x: 0,
  y: 0,
});

function renderLabel(option: DropdownOption) {
  return (
    <div class="flex w-50 justify-between items-center">
      <span>{option.label}</span>
      <span class="flex items-center gap-1">
        {(option?.keys as string[] || [])?.map((key: string) => (
          <span class="text-xs font-medium text-black/80 font-mono px-1 rounded-sm bg-black/06">{key}</span>
        ))}
      </span>
    </div>
  );
}

function handleContextMenu(e: MouseEvent) {
  e.preventDefault();
  showDropdown.value = false;
  nextTick().then(() => {
    showDropdown.value = true;
    dropdownPosition.x = e.clientX;
    dropdownPosition.y = e.clientY;
  });
}
function onClickoutside() {
  showDropdown.value = false;
}
function handleSelect(key: string) {
  // console.log(key);
  emit('select', key);
  showDropdown.value = false;
}
</script>

<template>
  <div class="display-inherit" @contextmenu="handleContextMenu">
    <slot />
  </div>
  <NDropdown
    :options
    :render-label
    size="small"
    placement="bottom-start"
    trigger="manual"
    :x="dropdownPosition.x"
    :y="dropdownPosition.y"
    :show="showDropdown"
    :on-clickoutside="onClickoutside"
    @select="handleSelect"
  />
</template>
