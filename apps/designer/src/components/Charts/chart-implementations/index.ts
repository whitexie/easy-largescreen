import type { ChartImplementaion } from '@/types/charts';
import { BarChart } from './bar';

// 修改这里
const chartImplementations: Record<string, new () => ChartImplementaion> = {
  BarChart,
};

export default chartImplementations;
