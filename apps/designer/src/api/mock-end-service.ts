import type { Field } from '@/types/charts';
import localforage from 'localforage';

const dataTableStore = localforage.createInstance({ name: 'datasetData' });

interface AnalysisDataParams {
  datasetId: string
  dimensionFields: Field[]
  metricFields: Field[]
}

function transformData(data: any[], fields: Field[]): Record<string, any>[] {
  return data.reduce((acc, cur) => {
    const row: Record<string, any> = {};
    fields.forEach((field) => {
      row[field.id] = cur[field.fieldCode];
    });
    acc.push(row);
    return acc;
  }, []);
}

export async function getAnlysisData(params: AnalysisDataParams): Promise<Record<string, any>[]> {
  const { datasetId, dimensionFields, metricFields } = params;
  let data = await dataTableStore.getItem<any[]>(datasetId);
  if (!data) {
    return [];
  }

  data = transformData(data, dimensionFields.concat(metricFields));

  return data;
}
