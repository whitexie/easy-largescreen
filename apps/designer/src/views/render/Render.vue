<script setup lang="ts">
import { useWindowResize } from '@/composables/useWindowResize';
import { useLargeScreenRender } from '@/stores/designer/composables/useLargeScreenRender';
import WidgetRender from './WidgetRender.vue';

const props = defineProps<{
  id?: string
  config?: Omit<API.LargeScreenDetailDto, 'id' | 'isRelease'>
}>();

const scale = ref(1);
const largeScreenRender = useLargeScreenRender();
const { onWindowResize } = useWindowResize();
const canvasRef = computed({
  get() {
    return largeScreenRender.canvasRef;
  },
  set(value) {
    largeScreenRender.canvasRef = value;
  },
});

const canvasStyle = computed(() => {
  const { canvasBackgroundStyle, canvasStyle } = largeScreenRender;
  return {
    ...canvasBackgroundStyle.value,
    ...canvasStyle.value,
    transform: `translate(-50%, -50%) scale(${scale.value})`,
  };
});

function handleWindowResize() {
  const { innerWidth, innerHeight } = window;
  const { width, height } = largeScreenRender.state.pageConfig;

  const widthScale = innerWidth / width;
  const heightScale = innerHeight / height;

  scale.value = Math.min(widthScale, heightScale);
}

onMounted(async () => {
  await largeScreenRender.initConfig(props.id || props.config || {});
  onWindowResize(handleWindowResize);
  handleWindowResize();
});
</script>

<template>
  <div class="canvas-wrapper relative w-full h-full">
    <div ref="canvasRef" class=" absolute left-50% top-50%" :style="canvasStyle">
      <WidgetRender v-for="widget in largeScreenRender.widgets" :key="widget.id" :widget="widget" />
    </div>
  </div>
</template>
