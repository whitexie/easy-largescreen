/**
 * 该文件为 @umijs/openapi 插件自动生成，请勿随意修改。如需修改请通过配置 openapi.config.ts 进行定制化。
 */

import { request } from '@/utils';

/** 创建数据集 POST /dataset/createDataset */
export async function createDataset(body: API.CreateDatasetDto, options?: Record<string, any>) {
  return request<API.ResponseWrapper & { data?: API.Dataset }>(`/api/dataset/createDataset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取数据集详情, 含字段结构 GET /dataset/getDatasetDetailById */
export async function getDatasetDetailById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetDatasetDetailByIdParams,
  options?: Record<string, any>,
) {
  return request<API.ResponseWrapper & { data?: API.Dataset }>(
    `/api/dataset/getDatasetDetailById`,
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 获取数据集列表 GET /dataset/getDatasetList */
export async function getDatasetList(options?: Record<string, any>) {
  return request<API.ResponseWrapper & { data?: API.Dataset[] }>(`/api/dataset/getDatasetList`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取数据集字段结构 GET /dataset/getFieldsByDatasetId */
export async function getFieldsByDatasetId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetFieldsByDatasetIdParams,
  options?: Record<string, any>,
) {
  return request<API.ResponseWrapper & { data?: API.Field[] }>(
    `/api/dataset/getFieldsByDatasetId`,
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 获取数据集数据 POST /dataset/searchData */
export async function searchData(body: API.SearchDataDto, options?: Record<string, any>) {
  return request<API.ResponseWrapper & { data?: Record<string, string | number>[] }>(`/api/dataset/searchData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
