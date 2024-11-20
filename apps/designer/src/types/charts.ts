import type { CHART_TYPE } from '@/components/Charts/constants/chart';
import type { CellType } from '@yss/utils';

export interface FieldConfigItem {
  name: string
  type: FieldType
}

export type FieldType = 'dimension' | 'metric';
export type ValueType = CellType;

export type BoxId = keyof ChartRenderState['dropBoxSettings'];

export enum CalculateType {
  SUM = 'sum',
  AVG = 'avg',
  MAX = 'max',
  MIN = 'min',
  COUNT = 'count',
}

export interface OriginalField {
  id: string
  fieldCode: string
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

export interface ChartRenderState {
  datasetId: string
  chartType: CHART_TYPE
  dropBoxSettings: Record<string, Required<DropBoxSettings>>
  chartProps: Record<string, unknown>
}

export type ChartRederStateOptions = Partial<ChartRenderState> & {
  autoRequestData?: boolean
};

export interface BuildOptionsParams {
  dropBoxSettings: Record<string, Required<DropBoxSettings>>
  data: Record<string, string | number>[]
}

export interface ValidateParams<T = Record<string, unknown>> {
  dropBoxSettings: Record<string, Required<DropBoxSettings>>
  props: T
}

export interface ChartImplementaion<Props = Record<string, unknown>> {
  readonly dropBoxSettings: Record<string, DropBoxSettings>
  readonly props: Props
  getDefaultDropBoxSettings: () => Record<string, DropBoxSettings>
  getDefaultProps: () => Props
  validate: (params: ValidateParams<Props>) => void
  buildOptions: (params: BuildOptionsParams) => Record<string, any>
}
