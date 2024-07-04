<script lang="ts" setup>
import type { TextProps } from './config';
import type { DataLargeScreenField } from '@/types/dataLargeScreen';

interface Props {
  widget: DataLargeScreenField<TextProps>
}

defineProps<Props>();
</script>

<template>
  <div>
    {{ widget.props.content }}
  </div>
</template>

<style scoped>
</style>
