import type { CellType } from '@yss/dashboard-core';

export interface FieldConfigItem {
  name: string
  type: FieldType
}

export type FieldType = 'dimension' | 'metric';
export type ValueType = CellType;

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
  valueType: ValueType
}

export interface Field extends OriginalField {
  fieldType: FieldType
  fieldCode: string
  datasetId: string
  // 计算方式
  calculateType: CalculateType
}

export interface DropBoxSettings {
  id: BoxId
  title: string
  fieldType: FieldType
  fields?: Field[]
}

export interface ChartRederStateOptions {
  datasetId: string
  dropBoxSettings: Record<string, Required<DropBoxSettings>>
}
