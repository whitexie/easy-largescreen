import type { OriginalField } from '@/types/charts';
import api from '@/api';
import { computed, onMounted, reactive, type Ref, watch } from 'vue';

export function useDatasetList() {
  const datasetList = reactive<API.Dataset[]>([]);

  async function updateDatasetList() {
    datasetList.splice(0, datasetList.length);
    const result = await api.dataset.getDatasetList();
    datasetList.push(...result.data);
  }

  onMounted(() => {
    updateDatasetList();
  });

  return {
    datasetList,
    updateDatasetList,
  };
}

export function useFields(id: Ref<string>) {
  const fields = reactive<OriginalField[]>([]);

  const dimensionFields = computed(() => {
    return fields.filter(item => item.valueType !== 'number');
  });
  const metricFields = computed(() => {
    return fields.filter(item => item.valueType === 'number');
  });

  watch(
    () => id.value,
    async (val) => {
      if (!val) {
        return;
      }

      const result = await api.dataset.getFieldsByDatasetId({ datasetId: val });
      if (result.error === 0) {
        fields.splice(0, fields.length);
        fields.push(...result.data);
      }
    },
    { immediate: true },
  );

  return {
    dimensionFields,
    metricFields,
  };
}
