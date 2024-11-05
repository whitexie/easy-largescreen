<script setup lang="ts">
import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import TextConfig from '@/dataLargeScreenFields/Text';

interface Props {
  widget: DataLargeScreenField
  hiddenLayout?: boolean
}

const props = defineProps<Props>();

// TODO: 组件注册
const componentMap = { text: TextConfig.Render } as const;

const RenderComponent = computed(() => {
  const component = props.widget.component.toLowerCase();
  if (Object.keys(componentMap).includes(component)) {
    return componentMap[component as keyof typeof componentMap];
  }

  return '';
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
