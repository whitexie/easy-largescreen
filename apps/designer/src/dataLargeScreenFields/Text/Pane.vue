<script name="TextPane" lang="ts" setup>
import type { TextProps } from './config';
import type { DataLargeScreenField } from '@/types/dataLargeScreen';

interface Props {
  widget: DataLargeScreenField<TextProps>
}

const props = defineProps<Props>();

const textStyle = computed(() => {
  return props.widget.props.style;
});
</script>

<template>
  <div class="text-pane">
    <n-collapse :default-expanded-names="['1', '2']" class="mt-4">
      <n-collapse-item title="文本内容" name="1">
        <div class="px-2">
          <n-input v-model:value="widget.props.content" type="textarea" />
        </div>
      </n-collapse-item>
      <n-collapse-item title="文本样式" name="2">
        <div class="px-2">
          <div class="flex items-center gap-1">
            <div class="shrink-0">
              颜色
            </div>
            <n-color-picker v-model:value="textStyle.color" size="small" />
          </div>
          <div class="flex items-center gap-1 mt-1">
            <div class="shrink-0">
              字号
            </div>
            <n-input-number v-model:value="textStyle.fontSize" size="small" />
          </div>
        </div>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<style scoped>
</style>
