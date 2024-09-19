import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';

const instance = axios.create({
  // baseURL: '/api',
});

export default async function request<T>(url: string, params: AxiosRequestConfig): Promise<T> {
  const result = await instance<T>({
    ...params,
    url,
  });

  return result.data;
}
