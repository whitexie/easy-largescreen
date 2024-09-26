import type { BoxId, Field } from '@/types/charts';
import { useChartRender } from './useChartRender';

export function useChartDesigner(_datasetId?: string) {
  const { state, datasetId, chartConfig, ...args } = useChartRender({ datasetId: _datasetId || '', autoRequestData: false });

  function updateFiledIndex(type: BoxId, field: Field, newIndex: number) {
    const fields = state.dropBoxSettings[type].fields;
    const oldIndex = fields.findIndex(item => item.id === field.id);
    if (oldIndex === -1) {
      throw new Error('field not found');
    }

    fields.splice(oldIndex, 1);
    fields.splice(newIndex, 0, field);
  }

  return {
    state,
    datasetId,
    updateFiledIndex,
    chartConfig,
    ...args,
  };
}
