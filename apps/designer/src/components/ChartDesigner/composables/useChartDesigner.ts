import type { BoxId, ChartRenderState, Field } from '@/types/charts';
import { useChartRender } from './useChartRender';

export function useChartDesigner(options: Partial<ChartRenderState>) {
  const { state, datasetId, chartConfig, ...args } = useChartRender({ ...options, autoRequestData: false });

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
