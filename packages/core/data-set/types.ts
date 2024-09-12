export type CellType = 'number' | 'date' | 'string' | 'null';

export interface Field {
  id: string
  name: string
  valueType: CellType
}

export type RawData = Record<string, null | string | Date | number>[];
