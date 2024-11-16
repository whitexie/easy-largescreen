declare namespace API {
  interface Background {
    /** 背景颜色 */
    color: string
    /** 背景图片 */
    image: string
  }

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
    datasetCode: string
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

  interface DeleteLargescreenDto {
    /** id */
    id: string
  }

  interface DetailParams {
    id: string
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

  interface LargeScreenDetailDto {
    /** id */
    id: string
    /** 数据集名称 */
    name: string
    /** 页面配置 */
    pageConfig: PageConfig
    /** 页面组件 */
    widgets: Widget[]
    /** 是否发布, 1: 发布, 0: 取消发布 */
    isRelease: 0 | 1
  }

  interface LargeScreenDto {
    /** id */
    id: string
    /** 数据集名称 */
    name: string
    /** 是否发布, 1: 发布, 0: 取消发布 */
    isRelease: 0 | 1
  }

  interface Location {
    /** x */
    x: number
    /** y */
    y: number
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

  interface PageConfig {
    /** 背景配置 */
    background: Background
    /** 宽度 */
    width: number
    /** 高度 */
    height: number
  }

  interface ReleaseLargescreenDto {
    /** id */
    id: string
    /** 是否发布, 1: 发布, 0: 取消发布 */
    isRelease: 0 | 1
  }

  interface ResponseWrapper {
    data: Record<string, any>
    error: number
    msg: string
  }

  interface SaveLargescreenDto {
    /** id */
    id?: string
    /** 数据集名称 */
    name: string
    /** 页面配置 */
    pageConfig: PageConfig
    /** 页面组件 */
    widgets: Widget[]
  }

  interface SearchDataDto {
    datasetId: string
    dimensionFields: FieldDto[]
    metricFields: MetricFieldDto[]
  }

  interface Size {
    /** 宽度 */
    width: number
    /** 高度 */
    height: number
  }

  interface String {}

  interface UploadTokenDto {
    /** 上传凭证 */
    token: string
    /** token 过期时间 */
    expiresTime: number
  }

  interface Widget {
    /** id */
    id: string
    /** 名称 */
    name: string
    /** 渲染组件 */
    component: string
    /** 宽高 */
    size: Size
    /** 位置 */
    location: Location
    /** 组件配置 */
    props: Record<string, any>
  }
}
