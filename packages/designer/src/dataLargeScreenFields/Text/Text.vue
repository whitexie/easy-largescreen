<script lang="ts" setup>
import type { TextProps } from './config';
import type { DataLargeScreenField } from '@/types/dataLargeScreen';

interface Props {
  widget: DataLargeScreenField<TextProps>
}

const props = defineProps<Props>();
const textStyle = computed(() => {
  const { color, fontSize } = props.widget.props.style;

  return {
    color,
    fontSize: `${fontSize}px`,
  };
});
</script>

<template>
  <div class="widget-text" :style="textStyle">
    {{ widget.props.content }}
  </div>
</template>

<style scoped>
.widget-text {
  white-space: pre-line;
  word-break: break-all;
}
</style>
