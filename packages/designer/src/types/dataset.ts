import type { Field, RawData } from '@yss/dashboard-core';

export interface Dataset {
  name: string
  fields: Field[]
  data: RawData[]
}

export interface DatasetList {
  id: string
  name: string
  fields: number
  data: number
}
