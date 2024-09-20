import type { ChartImplementaion, DropBoxSettings } from '@/types/charts';

export class BarChart implements ChartImplementaion<object> {
  readonly dropBoxSettings: Record<string, DropBoxSettings> = {
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
  };

  readonly props: object = {};

  validate() {
    return {
      success: true,
      message: '验证通过',
    };
  }

  buildOptions(): Record<string, any> {
    return {};
  }
}
