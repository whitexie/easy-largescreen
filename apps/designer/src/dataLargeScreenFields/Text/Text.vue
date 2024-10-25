<script lang="ts" setup>
import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import type { TextProps } from './config';

interface Props {
  widget: DataLargeScreenField<TextProps>
}

const props = defineProps<Props>();
const textStyle = computed(() => {
  const { fontSize, ...arg } = props.widget.props.style;

  return {
    ...arg,
    fontSize: `${fontSize}px`,
  };
});
</script>

<template>
  <div class="widget-text-wrap table w-full h-full">
    <div class="widget-text table-cell select-none" :style="textStyle">
      <p class="m-0">
        {{ widget.props.content }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.widget-text {
  white-space: pre-line;
  word-break: break-word;
}
</style>
