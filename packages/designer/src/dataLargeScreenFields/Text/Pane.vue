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
    <h2>this is TextPane</h2>
  </div>
</template>

<style scoped>
</style>
