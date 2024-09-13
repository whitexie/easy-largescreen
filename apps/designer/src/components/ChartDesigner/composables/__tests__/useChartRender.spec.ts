import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { useChartRender } from '../useChartRender';
import { CalculateType, type OriginalField } from '@/types/charts';

describe('useChartRender', () => {
  it('应该正确初始化状态', () => {
    const { state } = useChartRender();
    expect(state.datasetId).toBe('');
    expect(state.dropBoxSettings).toHaveProperty('xAxis');
    expect(state.dropBoxSettings).toHaveProperty('yAxis');
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
});
