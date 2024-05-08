<script lang="ts" setup>
import { useDraggable } from './useDraggable';
import TextConfig from '@/dataLargeScreenFields/Text';
import { useLargeScreenDesigner } from '@/stores/designer';
import type { DataLargeScreenField } from '@/types/dataLargeScreen';

interface Props {
  widget: DataLargeScreenField
}

const props = defineProps<Props>();
const emits = defineEmits<{
  clickWidget: [DataLargeScreenField]
  mousedown: [MouseEvent, DataLargeScreenField]
}>();
const designerStore = useLargeScreenDesigner();

const componentMap = { text: TextConfig.Render } as const;

const layoutStyle = computed(() => {
  const { size, location } = props.widget;
  return {
    width: `${size[0]}px`,
    height: `${size[1]}px`,
    transform: `translate(${location[0]}px, ${location[1]}px)`,
  };
});

const RenderComponent = computed(() => {
  const component = props.widget.component.toLowerCase();
  console.log('component', component);
  if (Object.keys(componentMap).includes(component))
    return componentMap[component as keyof typeof componentMap];

  return '';
});

const activeWidget = computed(() => designerStore.temporaryState.currentWidgetId === props.widget.id);

function handleClickWidget() {
  emits('clickWidget', props.widget);
  // designerStore.setCurrentWidget(props.widget.id);
}

function handleMouseDown(event: MouseEvent) {
  emits('mousedown', event, props.widget);
}
</script>

<template>
  <div v-if="RenderComponent" class="border absolute top-0 left-0 border-gray-400 bg-pink cursor-pointer" :style="layoutStyle" @mousedown="handleMouseDown" @click.stop="handleClickWidget">
    <template v-if="activeWidget">
      <div class="mask absolute top-0 left-0 bottom-0 right-0 z-60001" />
      <!-- 左上 -->
      <div class="graphicbox-resize absolute z-10 w-10px h-10px  border-amber cursor-nwse-resize top-0 left-0 mt--2px ml--2px border-t-2 border-l-2 border-l-solid border-t-solid" />
      <!-- 左下 -->
      <div class="graphicbox-resize absolute z-10 w-10px h-10px  border-amber cursor-nesw-resize bottom-0 left-0 mb--2px ml--2px border-b-2 border-b-solid border-l-2 border-l-solid " />
      <!-- 上 -->
      <div class="graphicbox-resize absolute z-10 w-10px h-10px  border-amber cursor-ns-resize top-0 left-50% mt--2px border-t-2 border-t-solid" />
      <!-- 下 -->
      <div class="graphicbox-resize absolute z-10 w-10px h-10px  border-amber cursor-ns-resize bottom-0 left-50% mb--2px border-b-2 border-b-solid" />
      <!-- 右上 -->
      <div class="graphicbox-resize absolute z-10 w-10px h-10px  border-amber cursor-nesw-resize top-0 right-0 mt--2px mr--2px  border-t-2 border-t-solid border-r-2 border-r-solid" />
      <!-- 右 -->
      <div class="graphicbox-resize absolute z-10 w-10px h-10px  border-amber cursor-ew-resize top-50% right-0 mr--2px  border-r-2 border-r-solid" />
      <!-- 左 -->
      <div class="graphicbox-resize absolute z-10 w-10px h-10px  border-amber cursor-ew-resize top-50% left-0 ml--2px border-l-2 border-l-solid" />
      <!-- 右下 -->
      <div class="graphicbox-resize absolute z-10 w-10px h-10px  border-amber cursor-nwse-resize bottom-0 right-0 mb--2px mr--2px border-b-2 border-b-solid border-r-2 border-r-solid" />
    </template>
    <div class="relative z-6000 w-full h-full hidden">
      <component :is="RenderComponent" />
    </div>
  </div>
</template>

<style scoped>
.mask {
  pointer-events: none;
}
</style>
