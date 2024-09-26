import type { BuildOptionsParams, ChartImplementaion, DropBoxSettings, ValidateParams } from '@/types/charts';
import { toRaw } from 'vue';

export class BarChart implements ChartImplementaion {
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

  readonly props = {};

  getDefaultDropBoxSettings(): Record<string, DropBoxSettings> {
    return structuredClone(this.dropBoxSettings);
  }

  getDefaultProps(): Record<string, any> {
    return structuredClone(this.props);
  }

  validate({ dropBoxSettings }: ValidateParams): void | Error {
    // throw new Error('validate error');
    const { xAxis, yAxis } = dropBoxSettings;
    if (yAxis.fields.length < 1) {
      throw new Error('Y轴必须有一个字段');
    }

    if (xAxis.fields.length !== 1) {
      throw new Error('X轴必须有一个字段');
    }
  }

  buildOptions({ dropBoxSettings, data }: BuildOptionsParams): Record<string, any> {
    const _options = {
      type: 'view',
      data: toRaw(data),
      children: [
        {
          type: 'interval',
          encode: {
            x: dropBoxSettings.xAxis.fields[0].id,
            y: dropBoxSettings.yAxis.fields[0].id,
            color: dropBoxSettings.xAxis.fields[0].id,
          },
          axis: {
            x: {
              title: dropBoxSettings.xAxis.fields[0].name,
            },
            y: {
              title: dropBoxSettings.yAxis.fields[0].name,
            },
          },
          tooltip: {
            items: [
              {
                name: dropBoxSettings.yAxis.fields[0].name,
                field: dropBoxSettings.yAxis.fields[0].id,
              },
            ],
          },
        },

      ],
      interaction: { elementHighlight: { background: true } },

    };
    return _options;
  }
}
