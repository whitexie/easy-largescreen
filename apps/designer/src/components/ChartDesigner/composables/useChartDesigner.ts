import type { OriginalField } from '@/types/charts';
import { getDatasetFields } from '@/api/dataset';
import { computed, type Ref, ref, watch } from 'vue';
import { useChartRender } from './useChartRender';

export function useChartDesigner(_datasetId?: string) {
  const { state, datasetId, addField, removeField } = useChartRender({ datasetId: _datasetId || '' });
  const { fields, metricFields, dimensionFields, setDatasetId } = useDatasetStore(datasetId);

  return {
    state,
    fields,
    datasetId,
    metricFields,
    dimensionFields,
    setDatasetId,
    addField,
    removeField,
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
