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
  });

  describe('updateState', () => {
    describe('应该正确初始化dropBoxSettings', () => {
      it('chartRederStateOptions 包含 dropBoxSettings时', () => {
        const dropBoxSettings: ChartRederStateOptions['dropBoxSettings'] = {
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
          dropBoxSettings,
          autoRequestData: false,
        };

        const { state } = useChartRender(options);
        expect(state.dropBoxSettings).toEqual(dropBoxSettings);
      });
    });

    it('应该正确更新datasetId', async () => {
      const { datasetId } = useChartRender();
      datasetId.value = 'test-dataset';
      await nextTick();
      expect(datasetId.value).toBe('test-dataset');
    });
  });

  it('应该正确添加度量字段', () => {
    vi.spyOn(utils, 'generateId')
      .mockReturnValueOnce('test-field');
    const { state, addField } = useChartRender({ chartType: 'Bar', autoRequestData: false });
    const fieldOption = {
      id: 'test-field',
      fieldCode: 'amount',
      name: 'Test Field',
      valueType: 'number',
    } as OriginalField;

    addField('yAxis', fieldOption, 0);

    expect(state.dropBoxSettings.yAxis.fields).toHaveLength(1);
    expect(state.dropBoxSettings.yAxis.fields[0]).toMatchObject({
      fieldCode: fieldOption.fieldCode,
      name: fieldOption.name,
      valueType: fieldOption.valueType,
      fieldType: 'metric',
      calculateType: CalculateType.SUM,
    });
  });

  it('应该正确添加维度字段', () => {
    vi.spyOn(utils, 'generateId')
      .mockReturnValueOnce('provinces-1');

    const { state, addField } = useChartRender({ chartType: 'Bar', autoRequestData: false });
    const fieldOption = {
      fieldCode: 'test_field',
      name: 'Test Field',
      valueType: 'string',
    } as OriginalField;

    addField('xAxis', fieldOption);

    expect(state.dropBoxSettings.xAxis.fields).toHaveLength(1);
    expect(state.dropBoxSettings.xAxis.fields[0]).toMatchObject({
      id: 'provinces-1',
      fieldCode: fieldOption.fieldCode,
      name: fieldOption.name,
      valueType: fieldOption.valueType,
      fieldType: 'dimension',
      calculateType: CalculateType.COUNT,
    });

    vi.clearAllMocks();
  });

  it('应该正确删除字段', () => {
    const { state, addField, removeField } = useChartRender({ chartType: 'Bar' });
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
      const { addField, requestData, datasetId } = useChartRender({ chartType: 'Bar', autoRequestData: false });

      datasetId.value = 'test-dataset';

      addField('xAxis', {
        id: 'provinces',
        fieldCode: 'provinces',
        name: '省份',
        valueType: 'string',
      });

      addField('yAxis', {
        id: 'amount',
        name: '金额',
        fieldCode: 'amount',
        valueType: 'number',
      });

      const expecteData = [
        { 'provinces-1': '广东', 'amount-1': 100 },
        { 'provinces-1': '广西', 'amount-1': 200 },
      ];

      const fn = vi.spyOn(api.dataset, 'searchData')
        .mockReturnValueOnce(Promise.resolve({ error: 0, data: expecteData, msg: 'success' }));

      const data = await requestData();

      expect(data).toEqual(expecteData);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
