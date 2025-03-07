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
  (e: 'clickWidget', event: Event, widget: DataLargeScreenField): void
  (e: 'mousedown', event: MouseEvent, widget: DataLargeScreenField): void
  (e: 'resize', horizontal: -1 | 0 | 1, vertical: -1 | 0 | 1): void
}>();
const widgetRef = ref<HTMLDivElement | null>(null);
const designerStore = useLargeScreenDesigner();
const themeVars = useThemeVars();

const commonClass = 'graphicbox-resize select-none  absolute z-10 w-10px h-10px';

const primaryHoverColor = computed(() => `${themeVars.value.primaryColor}20`);
const primaryColor = computed(() => themeVars.value.primaryColor);
const activeWidget = computed(() => designerStore.selectedWidgetIdSet.has(props.widget.id));
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

function handleClickWidget(event: Event) {
  emits('clickWidget', event, props.widget);
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
  <div ref="widgetRef" :class="{ 'active-widget': activeWidget, 'cursor-not-allowed': widget.isLock }" class="designer-widget absolute top-0 left-0 border-gray-400 cursor-pointer" :style="layoutStyle" @mousedown="handleMouseDown" @click.stop="handleClickWidget">
    <template v-if="activeWidget && !widget.isLock && designerStore.selectedWidgets.length === 1">
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
    <div class="mask absolute top-0 left-0 bottom-0 right-0 z-60001" />
  </div>
</template>

<style lang="less" scoped>
.designer-widget {
  &:hover,
  &.active-widget {
    border: 1px solid v-bind(primaryColor);
    box-shadow: 0 0 8px v-bind(primaryHoverColor);
  }

  &:not(.active-widget):hover {
    border: 1px dashed v-bind(primaryHoverColor);
    border-style: dashed;
  }
}

.graphicbox-resize {
  border-color: v-bind(primaryColor);
}
</style>
