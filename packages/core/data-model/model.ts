interface Field {
  name: string
  type: 'string' | 'number' | 'date'
}

type RawData = (Date | string | number)[];

interface DataModelOpt {
  data: RawData[]
  fields: Field[]
}

export class DataModel {
  public data: RawData[] = [];
  public fileds: Field[] = [];

  constructor(option: DataModelOpt) {
    const { data, fields } = option;
    this.data = data;
    this.fileds = fields;
  }

  get metricFields() {
    return this.fileds.filter(field => field.type === 'number');
  }

  get dimensionalFields() {
    return this.fileds.filter(field => field.type !== 'number');
  }
}
