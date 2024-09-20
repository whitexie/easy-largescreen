import type { DropBoxSettings } from '@/types/charts';

export interface ChartConfig<T = Record<string, unknown>> {
  id: string
  name: string
  dropBoxSettings: Record<string, DropBoxSettings>
  props: T
}

export const CHART_MAPPING = Object.freeze<Record<string, ChartConfig>>({
  bar: {
    id: 'bar',
    name: '柱状图',
    dropBoxSettings: {
      xAxis: {
        id: 'xAxis',
        title: 'X轴',
        fieldType: 'dimension',
      },
      yAxis: {
        id: 'yAxis',
        title: 'Y轴',
        fieldType: 'metric',
      },
    },
    props: {},
  },
  map: {
    id: 'map',
    name: '地图',
    dropBoxSettings: {
      coordinates: {
        id: 'coordinates',
        title: '坐标',
        fieldType: 'dimension',
      },
    },
    props: {},
  },
} as const);

export type CHART_TYPE = keyof (typeof CHART_MAPPING);
