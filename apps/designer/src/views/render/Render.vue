<script setup lang="ts">
import { useWindowResize } from '@/composables/useWindowResize';
import { useLargeScreenRender } from '@/stores/designer/composables/useLargeScreenRender';
import WidgetRender from './WidgetRender.vue';

const props = defineProps<{
  id: string
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
  const { pageConfig: { width, height, background: { color, image } } } = largeScreenRender.state;

  return {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: color,
    backgroundImage: image,
    backgroundSize: 'cover',
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
  await largeScreenRender.initConfig(props.id);
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
