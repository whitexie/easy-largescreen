export type CellType = 'string' | 'number' | 'date';

export interface Field {
  id: string
  name: string
  valueType: CellType
}

export interface RawData {
  [key: string]: any
}
