/**
 * 该文件为 @umijs/openapi 插件自动生成，请勿随意修改。如需修改请通过配置 openapi.config.ts 进行定制化。
 */

import { request } from '@/utils';

/** 获取上传凭证 POST /resource/getUploadToken */
export async function getUploadToken(options?: Record<string, any>) {
  return request<API.ResponseWrapper & { data?: API.UploadTokenDto }>(
    `/api/resource/getUploadToken`,
    {
      method: 'POST',
      ...(options || {}),
    },
  );
}
