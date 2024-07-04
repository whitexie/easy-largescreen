<script name="TextPane" lang="ts" setup>
import type { TextProps } from './config';
import type { DataLargeScreenField } from '@/types/dataLargeScreen';

interface Props {
  widget: DataLargeScreenField<TextProps>
}

defineProps<Props>();
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
        <div>谢谢你</div>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<style scoped></style>
