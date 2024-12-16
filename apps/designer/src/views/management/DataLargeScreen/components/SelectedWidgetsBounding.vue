<script setup lang="ts">
import { useLargeScreenDesigner } from '@/stores/designer';
import { useThemeVars } from 'naive-ui';
import { storeToRefs } from 'pinia';

const designerStore = useLargeScreenDesigner();
const theme = useThemeVars();

const primaryColor = computed(() => theme.value.primaryColor);
const boxShadowColor = computed(() => `${primaryColor.value}50`);

const { selectionBounds } = storeToRefs(designerStore);

const style = computed(() => {
  const { x: left = 0, y: top = 0, width = 0, height = 0 } = selectionBounds.value || {};
  return {
    'left': `${left}px`,
    'top': `${top}px`,
    'width': `${width}px`,
    'height': `${height}px`,
    'box-shadow': ` 0 0 6px ${boxShadowColor.value}`,
    'border': `1px solid ${primaryColor.value}`,
  };
});
</script>

<template>
  <div v-show="selectionBounds" class="absolute cursor-move pointer-events-none" :style="style" />
</template>
