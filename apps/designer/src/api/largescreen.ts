/**
 * 该文件为 @umijs/openapi 插件自动生成，请勿随意修改。如需修改请通过配置 openapi.config.ts 进行定制化。
 * */

import { request } from '@/utils';

/** 创建大屏 POST /largescreen/create */
export async function create(body: API.SaveLargescreenDto, options?: Record<string, any>) {
  return request<API.ResponseWrapper & { data?: string }>(`/api/largescreen/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 大屏详情 GET /largescreen/detail/${param0} */
export async function detail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.DetailParams,
  options?: Record<string, any>,
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResponseWrapper & { data?: API.LargeScreenDetailDto }>(
    `/api/largescreen/detail/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 大屏列表 GET /largescreen/list */
export async function list(options?: Record<string, any>) {
  return request<API.ResponseWrapper & { data?: API.LargeScreenDto[] }>(`/api/largescreen/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 发布大屏 POST /largescreen/release */
export async function release(body: API.ReleaseLargescreenDto, options?: Record<string, any>) {
  return request<API.ResponseWrapper & { data?: string }>(`/api/largescreen/release`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除大屏 DELETE /largescreen/remove */
export async function remove(body: API.DeleteLargescreenDto, options?: Record<string, any>) {
  return request<API.ResponseWrapper & { data?: string }>(`/api/largescreen/remove`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
