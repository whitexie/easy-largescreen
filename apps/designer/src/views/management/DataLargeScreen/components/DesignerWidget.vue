<script lang="ts" setup>
import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import { useLargeScreenDesigner } from '@/stores/designer';
import WidgetRender from '@/views/render/WidgetRender.vue';
import { useThemeVars } from 'naive-ui';

interface Props {
  widget: DataLargeScreenField
}

const props = defineProps<Props>();
const emits = defineEmits<{
  clickWidget: [DataLargeScreenField]
  mousedown: [MouseEvent, DataLargeScreenField]
  resize: [ -1 | 0 | 1, -1 | 0 | 1]
}>();
const widgetRef = ref<HTMLDivElement | null>(null);
const designerStore = useLargeScreenDesigner();
const themeVars = useThemeVars();

const commonClass = 'graphicbox-resize select-none  absolute z-10 w-10px h-10px  border-amber';

const primaryColor = computed(() => themeVars.value.primaryColor);
const activeWidget = computed(() => designerStore.currentWidgetId === props.widget.id);
const layoutStyle = computed(() => {
  const { size: { width, height }, location: { x, y } } = props.widget;
  const zIndex = activeWidget.value ? 60001 : '';
  return {
    zIndex,
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(${x}px, ${y}px)`,
  };
});

function handleClickWidget() {
  emits('clickWidget', props.widget);
}

function handleMouseDown(event: MouseEvent) {
  emits('mousedown', event, props.widget);
}

function handleResize(horizontal: -1 | 0 | 1, vertical: -1 | 0 | 1) {
  emits('resize', horizontal, vertical);
}

onMounted(() => {
  if (widgetRef.value) {
    props.widget._el = widgetRef.value;
  }
});
</script>

<template>
  <div ref="widgetRef" :class="{ 'active-widget': activeWidget, 'cursor-not-allowed': widget.isLock }" class="border absolute top-0 left-0 border-gray-400 cursor-pointer" :style="layoutStyle" @mousedown="handleMouseDown" @click.stop="handleClickWidget">
    <template v-if="activeWidget && !widget.isLock">
      <!-- 左上 -->
      <div
        :class="commonClass"
        class="cursor-nwse-resize top-0 left-0 mt--2px ml--2px border-t-2 border-l-2 border-l-solid border-t-solid"
        @mousedown.stop="handleResize(-1, -1)"
      />
      <!-- 左下 -->
      <div
        :class="commonClass"
        class="cursor-nesw-resize bottom-0 left-0 mb--2px ml--2px border-b-2 border-b-solid border-l-2 border-l-solid"
        @mousedown.stop="handleResize(-1, 1)"
      />
      <!-- 上 -->
      <div
        :class="commonClass"
        class="cursor-ns-resize top-0 left-50% mt--2px border-t-2 border-t-solid"
        @mousedown.stop="handleResize(0, -1)"
      />
      <!-- 下 -->
      <div
        :class="commonClass"
        class="cursor-ns-resize bottom-0 left-50% mb--2px border-b-2 border-b-solid"
        @mousedown.stop="handleResize(0, 1)"
      />
      <!-- 右上 -->
      <div
        :class="commonClass"
        class="cursor-nesw-resize top-0 right-0 mt--2px mr--2px  border-t-2 border-t-solid border-r-2 border-r-solid"
        @mousedown.stop="handleResize(1, -1)"
      />
      <!-- 右 -->
      <div
        :class="commonClass"
        class="cursor-ew-resize top-50% translate-y-[-50%] right-0 mr--2px border-r-2 border-r-solid"
        @mousedown.stop="handleResize(1, 0)"
      />
      <!-- 左 -->
      <div
        :class="commonClass"
        class="cursor-ew-resize top-50% translate-y-[-50%] left-0 ml--2px border-l-2 border-l-solid"
        @mousedown.stop="handleResize(-1, 0)"
      />
      <!-- 右下 -->
      <div
        :class="commonClass"
        class="cursor-nwse-resize bottom-0 right-0 mb--2px mr--2px border-b-2 border-b-solid border-r-2 border-r-solid"
        @mousedown.stop="handleResize(1, 1)"
      />
    </template>
    <div class="w-full h-full overflow-hidden relative">
      <WidgetRender :widget="widget" :hidden-layout="true" />
    </div>
    <div class="mask absolute top-0 left-0 bottom-0 right-0 z-60001">
      <div class="hidden hover:(bg-black) opacity-70 select-none justify-center w-full h-full items-center">
        已锁定，无法移动或修改尺寸
      </div>
    </div>
  </div>
</template>

<style scoped>
.graphicbox-resize {
  border-color: v-bind(primaryColor);
}
.active-widget {
  transition: box-shadow 0.3s ease;
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.9),
    /* 白色内边框效果 */ 0 0 8px rgba(59, 130, 246, 0.5),
    /* 蓝色模糊扩散 */ 0 0 16px rgba(59, 130, 246, 0.3); /* 更大范围的蓝色阴影 */
}
</style>
