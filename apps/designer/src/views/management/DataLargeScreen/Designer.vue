<script lang="ts" setup>
import Layers from '@/components/Designer/Layers/index.vue';
import Pane from '@/components/Designer/PropsPane/Pane.vue';
import { useLargeScreenDesigner } from '@/stores/designer';
import { useMessage } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { provide } from 'vue';
import DesignerHeader from './DesignerHeader.vue';
import Footer from './Footer.vue';
import { CANVAS_ELEMENT_KEY } from './provideKey';
import WidgetCanvas from './WidgetCanvas.vue';

const props = defineProps<{
  id: string
}>();

const designerStore = useLargeScreenDesigner();
const message = useMessage();

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
