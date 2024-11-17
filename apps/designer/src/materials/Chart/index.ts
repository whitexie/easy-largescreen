import { registerMaterial } from '@/materials/base';
import { defineAsyncComponent } from 'vue';

registerMaterial({
  id: 'chart',
  name: '图表',
  icon: 'solar:chart-bold',
  size: { width: 400, height: 300 },
  renderComponent: defineAsyncComponent(() => import('./Chart.vue')),
  paneComponent: defineAsyncComponent(() => import('./Pane.vue')),
  props: {
    chartConfig: {},
  },
});
