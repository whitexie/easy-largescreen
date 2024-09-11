import { computed, ref } from 'vue';
import { getDatasetFields } from '@/api/dataset';
import type { Field as OriginalField } from '@/types/charts';

export function useChartDesignerStore() {
  const fields = ref<OriginalField[]>([]);
  const datasetId = ref('');
  const metricFields = computed(() => fields.value.filter(field => field.valueType === 'number'));
  const dimensionFields = computed(() => fields.value.filter(field => field.valueType !== 'number'));

  return {
    datasetId,
    metricFields,
    dimensionFields,
  };
}

export function useDatasetStore(datasetId: string) {
  const fields = ref<OriginalField[]>([]);

  async function init() {
    await getDatasetFields(datasetId);
  }

  return {
    fields,
    init,
  };
}
