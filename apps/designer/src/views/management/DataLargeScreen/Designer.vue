<script lang="ts" setup>
import { useLargeScreenDesigner } from '@/stores/designer';
import { calculateBoxSelectionCoordinates } from '@/utils/canvas';
import { loadAsyncComponent } from '@/utils/component';
import { useMessage } from 'naive-ui';
import { storeToRefs } from 'pinia';
import BoxSelection from './components/BoxSelection.vue';

const props = defineProps<{ id: string }>();

const designerStore = useLargeScreenDesigner();
const message = useMessage();
const drawerVisible = ref(false);
const { canvasContainerRef } = storeToRefs(designerStore);
const { boxSelectionRect, isBrushing } = storeToRefs(designerStore);

// ---- async component----
const DesignerHeader = loadAsyncComponent(() => import('./components/DesignerHeader.vue'));
const Footer = loadAsyncComponent(() => import('./components/Footer.vue'));
const DesignerCanvas = loadAsyncComponent(() => import('./components/DesignerCanvas.vue'));
const Layers = loadAsyncComponent(() => import('@/components/Designer/Layers/index.vue'));
const Pane = loadAsyncComponent(() => import('@/components/Designer/PropsPane/Pane.vue'));
const Render = loadAsyncComponent(() => import('@/views/render/Render.vue'));
window.$message = message;

watch(
  () => isBrushing.value,
  (val) => {
    if (val) {
      return;
    }
    if (!designerStore.canvasRef || !canvasContainerRef.value) {
      return;
    }
    const coordinates = calculateBoxSelectionCoordinates({
      canvasRef: designerStore.canvasRef,
      containerRef: canvasContainerRef.value,
      boxSelectionRect: boxSelectionRect.value,
      scale: designerStore.scale,
    });

    if (coordinates) {
      designerStore.calculateSelectedWidgetsBounding(coordinates);
    }
  },
  { immediate: true },
);

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
    <DesignerHeader @preview="drawerVisible = true" />
    <main class="h-calc[100%-50px] w-full relative grid grid-cols-3 canvas-warpper bg-#f2f2f2">
      <Layers />
      <div class="relative">
        <div
          ref="canvasContainerRef"
          class="relative bg-#f2f2f2 overflow-auto relative w-full flex-1 h-calc[100%-36px]"
        >
          <DesignerCanvas />
          <BoxSelection :is-brushing="isBrushing" :box-selection-rect="boxSelectionRect" />
        </div>
        <Footer />
      </div>
      <Pane />
    </main>
    <n-drawer v-model:show="drawerVisible" height="95vh" placement="bottom">
      <n-drawer-content title="预览" closable :scrollbar-props="{ 'content-class': ' w-full h-full' }">
        <Render :config="designerStore.getConfig()" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style lang="less" scoped>
.canvas-warpper {
  display: grid;
  gap: 1px;
  grid-template-columns: max-content 1fr max-content;
}
</style>
