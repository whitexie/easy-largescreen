<script lang="ts" setup>
import { provide } from 'vue';
import { storeToRefs } from 'pinia';
import WidgetCanvas from './WidgetCanvas.vue';
import Footer from './Footer.vue';
import DesignerHeader from './DesignerHeader.vue';
import { CANVAS_ELEMENT_KEY } from './provideKey';
import Layers from '@/components/Designer/Layers/index.vue';
import Pane from '@/components/Designer/PropsPane/Pane.vue';
import { useLargeScreenDesigner } from '@/stores/designer';

const designerStore = useLargeScreenDesigner();

provide(CANVAS_ELEMENT_KEY, storeToRefs(designerStore).canvasRef);
</script>

<template>
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
</template>

<style lang="less" scoped>
.canvas-warpper {
  display: grid;
  gap: 1px;
  grid-template-columns: max-content 1fr max-content;
}
.large-screen-canvas {
  --line-color: rgba(60, 10, 30, 0.2);
  background-image: linear-gradient(90deg, var(--line-color) 3%, transparent 0),
    linear-gradient(1turn, var(--line-color) 3%, transparent 0);
  background-size: 20px 20px;
}
</style>
