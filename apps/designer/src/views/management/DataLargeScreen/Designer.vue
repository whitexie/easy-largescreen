<script lang="ts" setup>
import { useLargeScreenDesigner } from '@/stores/designer';
import { loadAsyncComponent } from '@/utils/component';
import { useMessage } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { provide } from 'vue';
import { CANVAS_ELEMENT_KEY } from './provideKey';

const props = defineProps<{
  id: string
}>();

const designerStore = useLargeScreenDesigner();
const message = useMessage();

// ---- async component----
const DesignerHeader = loadAsyncComponent(() => import('./DesignerHeader.vue'));
const Footer = loadAsyncComponent(() => import('./Footer.vue'));
const WidgetCanvas = loadAsyncComponent(() => import('./WidgetCanvas.vue'));
const Layers = loadAsyncComponent(() => import('@/components/Designer/Layers/index.vue'));
const Pane = loadAsyncComponent(() => import('@/components/Designer/PropsPane/Pane.vue'));

window.$message = message;

provide(CANVAS_ELEMENT_KEY, storeToRefs(designerStore).canvasRef);

onMounted(() => {
  if (props.id && props.id !== 'new') {
    designerStore.initConfig(props.id);
  }
});

onUnmounted(() => {
  designerStore.$reset();
});
</script>

<template>
  <div class="w-full h-full overflow-hidden">
    <DesignerHeader />
    <main class="h-calc[100%-50px] w-full relative grid grid-cols-3 canvas-warpper bg-#f2f2f2">
      <Layers />
      <div class="relative">
        <div class="bg-#f2f2f2 overflow-auto relative w-full flex-1 p-7.5  h-calc[100%-36px]">
          <WidgetCanvas />
        </div>
        <Footer />
      </div>
      <Pane />
    </main>
  </div>
</template>

<style lang="less" scoped>
.canvas-warpper {
  display: grid;
  gap: 1px;
  grid-template-columns: max-content 1fr max-content;
}
</style>
