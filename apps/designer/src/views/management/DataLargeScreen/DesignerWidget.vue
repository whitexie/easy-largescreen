<script lang="ts" setup>
import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import TextConfig from '@/dataLargeScreenFields/Text';
import { useLargeScreenDesigner } from '@/stores/designer';
import { inject, type Ref } from 'vue';
import { CANVAS_ELEMENT_KEY } from './provideKey';
import { useWidgetResize } from './useWidgetResize';

interface Props {
  // TODO 类型约束
  widget: DataLargeScreenField<any>
}

const props = defineProps<Props>();
const emits = defineEmits<{
  clickWidget: [DataLargeScreenField]
  mousedown: [MouseEvent, DataLargeScreenField]
}>();
const canvasRef = inject<Ref<HTMLElement | null>>(CANVAS_ELEMENT_KEY, ref(null));
const widgetRef = ref<HTMLDivElement | null>(null);
const designerStore = useLargeScreenDesigner();
const { handleActiveResize } = useWidgetResize();

const commonClass = 'graphicbox-resize absolute z-10 w-10px h-10px  border-amber';

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
  if (Object.keys(componentMap).includes(component)) {
    return componentMap[component as keyof typeof componentMap];
  }

  return '';
});

const activeWidget = computed(() => designerStore.temporaryState.currentWidgetId === props.widget.id);

function handleClickWidget() {
  emits('clickWidget', props.widget);
}

function handleMouseDown(event: MouseEvent) {
  emits('mousedown', event, props.widget);
}

function handleResize(horizontal: -1 | 0 | 1, vertical: -1 | 0 | 1) {
  const scale = designerStore.temporaryState.scale / 100;
  handleActiveResize(props.widget, canvasRef.value, horizontal, vertical, scale);
}

onMounted(() => {
  if (widgetRef.value) {
    props.widget._el = widgetRef.value;
  }
});
</script>

<template>
  <div ref="widgetRef" class="border absolute top-0 left-0 border-gray-400 cursor-pointer" :style="layoutStyle" @mousedown="handleMouseDown" @click.stop="handleClickWidget">
    <template v-if="activeWidget">
      <div class="mask absolute top-0 left-0 bottom-0 right-0 z-60001" />
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
    <div class="w-full h-full overflow-hidden">
      <component :is="RenderComponent" :widget="widget" />
    </div>
  </div>
</template>

<style scoped>
.mask {
  pointer-events: none;
}
</style>
