<script setup lang="ts">
import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import { getRenderComponent } from '@/materials/base';

interface Props {
  widget: DataLargeScreenField
  hiddenLayout?: boolean
}

const props = defineProps<Props>();

const RenderComponent = computed(() => {
  const component = props.widget.component;
  return getRenderComponent(component);
});

const layoutStyle = computed(() => {
  const { size: { width, height }, location: { x, y } } = props.widget;
  return props.hiddenLayout
    ? {}
    : {
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${x}px, ${y}px)`,
      };
});
</script>

<template>
  <div class="absolute w-full h-full" :style="layoutStyle">
    <component :is="RenderComponent" :widget="widget" />
  </div>
</template>

<style scoped>

</style>
