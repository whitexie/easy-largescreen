import { registerMaterial } from '@/materials/base';
import Chart from './Chart.vue';
import Pane from './Pane.vue';

registerMaterial({
  id: 'chart',
  name: '图表',
  icon: 'solar:chart-bold',
  size: { width: 400, height: 300 },
  renderComponent: Chart,
  paneComponent: Pane,
  props: {
    chartConfig: {},
  },
});
