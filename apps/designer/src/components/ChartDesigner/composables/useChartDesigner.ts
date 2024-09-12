import { computed, ref, watch } from 'vue';
import { getDatasetFields } from '@/api/dataset';
import type { Field as OriginalField } from '@/types/charts';

export function useChartDesigner(_datasetId?: string) {
  const { datasetId, fields, metricFields, dimensionFields, setDatasetId } = useDatasetStore(_datasetId || '');

  return {
    fields,
    datasetId,
    metricFields,
    dimensionFields,
    setDatasetId,
  };
}

export function useDatasetStore(_datasetId: string) {
  const datasetId = ref(_datasetId);
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
    const res = await getDatasetFields(datasetId.value);
    if (res) {
      fields.value = res;
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
