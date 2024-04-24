import localforage from 'localforage';
import type { Dataset, DatasetList } from '@/types/dataset';
import { generateRandomID } from '@/utils';

interface CreateDatasetReq extends Dataset {
  id: string
}

const datasetInstance = localforage.createInstance({ name: 'datasetList' });

const datasetDataInstance = localforage.createInstance({ name: 'datasetData' });

export async function getDatasetList(): Promise<DatasetList[]> {
  const result: DatasetList[] = [];

  await datasetInstance.iterate((value) => {
    result.push(value as DatasetList);
  });

  return result;
}

export async function createDataset(dataset: Dataset) {
  const req: CreateDatasetReq = {
    id: generateRandomID(),
    ...dataset,
  };

  const { fields, data, name } = dataset;
  await Promise.all([
    datasetDataInstance.setItem(req.id, req),
    datasetInstance.setItem(req.id, { id: req.id, name, fields: fields.length, data: data.length }),
  ]);
}

export async function deleteDataset(id: string) {
  await Promise.all([
    datasetDataInstance.removeItem(id),
    datasetInstance.removeItem(id),
  ]);
}

export async function getDatasetData(id: string) {
  return await datasetDataInstance.getItem(id);
}
