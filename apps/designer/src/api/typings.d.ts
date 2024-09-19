declare namespace API {
  interface CreateDatasetDto {
    /** 数据集名称 */
    name: string
    /** 数据集描述 */
    description?: string
    /** 数据集code */
    datasetCode: string
    /** 数据集字段 */
    fields: CreateFieldDto[]
  }

  interface CreateFieldDto {
    /** 所属表 */
    datasetCode?: string
    /** 字段code */
    fieldCode: string
    /** 字段名称 */
    name: string
    /** 字段描述 */
    description: string
    /** 字段类型 */
    valueType: 'string' | 'number' | 'date'
  }

  interface Dataset {
    /** 数据Id */
    id: string
    /** 数据创建时间 */
    created_time: string
    /** 数据更新时间 */
    updated_time: string
    /** 数据集名称 */
    name: string
    /** 数据集对应的数据表 */
    datasetCode: string
    /** 数据集描述 */
    description?: string
    /** 数据集字段 */
    fields: Field[]
  }

  interface Field {
    /** 数据Id */
    id: string
    /** 数据创建时间 */
    created_time: string
    /** 数据更新时间 */
    updated_time: string
    /** 所属表 */
    datasetCode: string
    /** 字段code */
    fieldCode: string
    /** 字段名称 */
    name: string
    /** 字段描述 */
    description: string
    /** 字段值类型 */
    valueType: 'string' | 'number' | 'date'
    /** 所属数据集ID */
    datasetId: string
  }

  interface FieldDto {
    fieldCode: string
    id: string
    name: string
    valueType: string
    fieldType: string
  }

  interface GetDatasetDetailByIdParams {
    datasetId: string
  }

  interface GetFieldsByDatasetIdParams {
    datasetId: string
  }

  interface MetricFieldDto {
    fieldCode: string
    id: string
    name: string
    valueType: string
    fieldType: string
    calculateType: string
  }

  interface Object {}

  interface ResponseWrapper {
    data: Record<string, any>
    error: number
    msg: string
  }

  interface SearchDataDto {
    datasetId: string
    dimensionFields: FieldDto[]
    metricFields: MetricFieldDto[]
  }
}
