import { onMounted } from 'vue';
import { getDatasetList } from '@/api';
import type { DatasetList } from '@/types/dataset';

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
