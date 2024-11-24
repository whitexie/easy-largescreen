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
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
  };
});
</script>

<template>
  <div v-show="selectionBounds" class="absolute selected-widgets-bounding" :style="style" />
</template>

<style lang="less" scoped>
.selected-widgets-bounding {
  box-shadow: 0 0 6px v-bind(boxShadowColor);
  border: 1px solid v-bind(primaryColor);
  cursor: move;
  pointer-events: none;
}
</style>
