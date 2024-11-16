import api from '@/api';
import * as qiniu from 'qiniu-js';

let token: string = '';
let expiresTime: number = 0;

async function getToken() {
  const _updateToken = async () => {
    const { error, data, msg } = await api.resource.getUploadToken();
    if (error) {
      throw new Error(msg);
    }
    token = data.token;
    expiresTime = data.expiresTime;
  };

  const time = Date.now() / 1000;

  if (time > expiresTime) {
    await _updateToken();
  }

  return token;
}

export async function uploadFile(file: File, key = null): Promise<string> {
  const token = await getToken();
  const config = {
    useCdnDomain: false,
  };
  const putExtra = { fname: file.name };
  return new Promise((resolve, reject) => {
    const observable = qiniu.upload(file, key, token, putExtra, config);
    observable.subscribe({
      error: reject,
      complete: async (res: { hash: string, key: string }) => {
        const url = [import.meta.env.VITE_QINIU_DOMAIN, res.key].join('/');
        resolve(url);
      },
    });
  });
}
