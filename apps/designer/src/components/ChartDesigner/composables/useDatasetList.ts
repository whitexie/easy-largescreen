import type { OriginalField } from '@/types/charts';
import type { DatasetList } from '@/types/dataset';
import { getDatasetFields, getDatasetList } from '@/api';
import { computed, onMounted, reactive, type Ref, watch } from 'vue';

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
