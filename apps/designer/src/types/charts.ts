export interface FieldConfigItem {
  name: string
  type: 'dimension' | 'metric'
}

export interface OriginalField {
  id: string
  name: string
  valueType: 'string' | 'number'
}

export interface Field extends OriginalField {
  type: 'dimension' | 'metric'
  valueType: 'string' | 'number'
  datasetId: string
  // 计算方式
  calculateType: 'sum' | 'avg' | 'max' | 'min'
}
