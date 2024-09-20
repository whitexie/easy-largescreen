import type { BoxId, Field, OriginalField } from '@/types/charts';
import api from '@/api';
import { computed, type Ref, ref, watch } from 'vue';
import { useChartRender } from './useChartRender';

export function useChartDesigner(_datasetId?: string) {
  const { state, datasetId, chartConfig, ...args } = useChartRender({ datasetId: _datasetId || '' });
  const { fields, metricFields, dimensionFields, setDatasetId } = useDatasetStore(datasetId);

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
    fields,
    datasetId,
    metricFields,
    dimensionFields,
    setDatasetId,
    updateFiledIndex,
    chartConfig,
    ...args,
  };
}

export function useDatasetStore(_datasetId: Ref<string>) {
  const datasetId = _datasetId || ref('');
  const fields = ref<OriginalField[]>([]);

  const metricFields = computed(() => fields.value.filter(field => field.valueType === 'number'));
  const dimensionFields = computed(() => fields.value.filter(field => field.valueType !== 'number'));

  function setDatasetId(id: string) {
    datasetId.value = id;
  }

  async function init() {
    if (!datasetId.value) {
      return;
    }
    const res = await api.dataset.getFieldsByDatasetId({ datasetId: datasetId.value });
    if (res.error === 0) {
      fields.value = res.data;
    }
  }

  watch(datasetId, () => {
    init();
  }, { immediate: true });

  return {
    fields,
    datasetId,
    metricFields,
    dimensionFields,
    init,
    setDatasetId,
  };
}
