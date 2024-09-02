import { defineStore } from 'pinia';
import localforage from 'localforage';

const datasetInstance = localforage.createInstance({
  name: 'dataset',
});

export const useDatasetManage = defineStore('datasetManage', () => {
  async function getDatasetList() {
    return datasetInstance.keys();
  }

  async function getDatasetItem<T>(name: string): Promise<T | null> {
    return await datasetInstance.getItem<T>(name);
  }

  async function setDatasetItem<T>(name: string, data: T) {
    await datasetInstance.setItem(name, data);
  }

  return {
    getDatasetList,
    getDatasetItem,
    setDatasetItem,
  };
});
