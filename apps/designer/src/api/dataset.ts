import type { Field } from '@/types/charts';
import type { Dataset, DatasetList } from '@/types/dataset';
import { generateRandomID } from '@/utils';
import localforage from 'localforage';

interface CreateDatasetReq extends Dataset {
  id: string
}

const datasetTableStore = localforage.createInstance({ name: 'datasetList' });
const fieldsTableStore = localforage.createInstance({ name: 'datasetFields' });

const dataTableStore = localforage.createInstance({ name: 'datasetData' });

export async function getDatasetList(): Promise<DatasetList[]> {
  const result: DatasetList[] = [];

  await datasetTableStore.iterate((value) => {
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
    dataTableStore.setItem(req.id, data),
    fieldsTableStore.setItem(req.id, fields),
    datasetTableStore.setItem(req.id, { id: req.id, name, fields: fields.length, data: data.length }),
  ]);
}

export async function deleteDataset(id: string) {
  await Promise.all([
    dataTableStore.removeItem(id),
    datasetTableStore.removeItem(id),
  ]);
}

export async function getDatasetData<T = unknown>(id: string): Promise<T[]> {
  const result = await dataTableStore.getItem<T[]>(id);
  return result || [];
}

export async function getDatasetFields(id: string) {
  return await fieldsTableStore.getItem<Field[]>(id);
}
