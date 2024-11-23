import { registerMaterial } from '@/materials/base';

registerMaterial({
  id: 'chart',
  name: '图表',
  icon: 'i-solar:chart-bold',
  size: { width: 400, height: 300 },
  props: {
    chartConfig: {},
  },
});
