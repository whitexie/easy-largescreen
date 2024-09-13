import { type Ref, computed, onMounted, reactive, watch } from 'vue';
import { getDatasetFields, getDatasetList } from '@/api';
import type { DatasetList } from '@/types/dataset';
import type { OriginalField } from '@/types/charts';

export function useDatasetList() {
  const datasetList = reactive<DatasetList[]>([]);

  async function updateDatasetList() {
    datasetList.splice(0, datasetList.length);
    const result = await getDatasetList();
    datasetList.push(...result);
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

      const result = await getDatasetFields(val);
      if (result) {
        fields.splice(0, fields.length);
        fields.push(...result);
      }
    },
    { immediate: true },
  );

  return {
    dimensionFields,
    metricFields,
  };
}
