import api from '@/api';
import { CalculateType, type ChartRederStateOptions, type OriginalField } from '@/types/charts';
import * as utils from '@yss/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { useChartRender } from '../useChartRender';

describe('useChartRender', () => {
  it('应该正确初始化状态', () => {
    const { state } = useChartRender();
    expect(state.datasetId).toBe('');
    expect(state.dropBoxSettings).toHaveProperty('xAxis');
    expect(state.dropBoxSettings).toHaveProperty('yAxis');
  });

  it('应该正确初始化dropBoxSettings', () => {
    const settings: ChartRederStateOptions['dropBoxSettings'] = {
      xAxis: {
        id: 'xAxis',
        title: 'X轴',
        fieldType: 'dimension',
        fields: [{
          name: '日期',
          valueType: 'date',
          fieldCode: 'ydqlmbGj',
          fieldType: 'dimension',
          datasetId: 'id-1726113264669dSQYOyWg',
          id: 'TU2MS9S4',
          calculateType: CalculateType.COUNT,
        }],
      },
      yAxis: {
        id: 'yAxis',
        title: 'Y轴',
        fieldType: 'metric',
        fields: [{
          name: '销售金额',
          valueType: 'number',
          fieldCode: 'yAQJDYrC',
          fieldType: 'metric',
          datasetId: 'id-1726113264669dSQYOyWg',
          id: '9PB11S17',
          calculateType: CalculateType.SUM,
        }],
      },
    };

    const options: Partial<ChartRederStateOptions> = {
      dropBoxSettings: settings,
    };

    const { state } = useChartRender(options);
    expect(state.dropBoxSettings).toEqual(settings);
  });

  it('应该正确更新datasetId', async () => {
    const { datasetId } = useChartRender();
    datasetId.value = 'test-dataset';
    await nextTick();
    expect(datasetId.value).toBe('test-dataset');
  });

  it('应该正确添加度量字段', () => {
    const { state, addField } = useChartRender();
    const fieldOption = {
      id: 'test-field',
      name: 'Test Field',
      valueType: 'number',
    } as OriginalField;

    addField('yAxis', fieldOption, 0);

    expect(state.dropBoxSettings.yAxis.fields).toHaveLength(1);
    expect(state.dropBoxSettings.yAxis.fields[0]).toMatchObject({
      fieldCode: fieldOption.id,
      name: fieldOption.name,
      valueType: fieldOption.valueType,
      fieldType: 'metric',
      calculateType: CalculateType.SUM,
    });
  });

  it('应该正确添加维度字段', () => {
    const { state, addField } = useChartRender();
    const fieldOption = {
      id: 'test-field',
      name: 'Test Field',
      valueType: 'string',
    } as OriginalField;

    addField('xAxis', fieldOption, 0);

    expect(state.dropBoxSettings.xAxis.fields).toHaveLength(1);
    expect(state.dropBoxSettings.xAxis.fields[0]).toMatchObject({
      fieldCode: fieldOption.id,
      name: fieldOption.name,
      valueType: fieldOption.valueType,
      fieldType: 'dimension',
      calculateType: CalculateType.COUNT,
    });
  });

  it('应该正确删除字段', () => {
    const { state, addField, removeField } = useChartRender();
    const fieldOption = {
      id: 'test-field',
      name: 'Test Field',
      valueType: 'number',
    } as OriginalField;

    const field = addField('yAxis', fieldOption, 0);
    removeField('yAxis', field.id);

    expect(state.dropBoxSettings.yAxis.fields).toHaveLength(0);
  });

  it('应该使用提供的选项初始化状态', () => {
    const options = {
      datasetId: 'initial-dataset',
    };
    const { state } = useChartRender(options);
    expect(state.datasetId).toBe('initial-dataset');
  });

  describe('requestData', () => {
    beforeEach(() => {
      vi.spyOn(utils, 'generateId')
        .mockReturnValueOnce('provinces-1')
        .mockReturnValueOnce('amount-1');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });
    it('应正确请求数据', async () => {
      const { addField, requestData, datasetId } = useChartRender();

      datasetId.value = 'test-dataset';

      addField('xAxis', {
        id: 'provinces',
        name: '省份',
        valueType: 'string',
      });

      addField('yAxis', {
        id: 'amount',
        name: '金额',
        valueType: 'number',
      });

      const expecteData = [
        { 'provinces-1': '广东', 'amount-1': 100 },
        { 'provinces-1': '广西', 'amount-1': 200 },
      ];

      vi.spyOn(api.dataset, 'searchData')
        .mockReturnValueOnce(Promise.resolve({ error: 0, data: expecteData, msg: 'success' }));

      const data = await requestData();

      expect(data).toEqual(expecteData);
    });
  });
});
