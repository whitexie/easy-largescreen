export interface FieldConfigItem {
  name: string
  type: FieldType
}

export type FieldType = 'dimension' | 'metric';

export type BoxId = keyof ChartRederStateOptions['dropBoxSettings'];

export enum CalculateType {
  SUM = 'sum',
  AVG = 'avg',
  MAX = 'max',
  MIN = 'min',
  COUNT = 'count',
}

export interface OriginalField {
  id: string
  name: string
  valueType: 'string' | 'number'
}

export interface Field extends OriginalField {
  fieldType: FieldType
  fieldCode: string
  datasetId: string
  // 计算方式
  calculateType: CalculateType
}

export interface DropBoxSettings {
  id: keyof ChartRederStateOptions['dropBoxSettings']
  title: string
  fieldType: FieldType
  fields?: Field[]
}

export interface ChartRederStateOptions {
  datasetId: string
  dropBoxSettings: Record<string, Required<DropBoxSettings>>
}
