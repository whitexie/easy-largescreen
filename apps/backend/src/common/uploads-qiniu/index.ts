import * as qiniu from 'qiniu';
import env from '../env.config';

const { QINIU_ACCESS_KEY, QINIU_SECRET_KEY, QINIU_BUCKET, QINIU_EXPIRES } = env;
const mac = new qiniu.auth.digest.Mac(QINIU_ACCESS_KEY, QINIU_SECRET_KEY);

const options = {
  scope: QINIU_BUCKET,
  expires: Number(QINIU_EXPIRES) || 7200,
};

console.log('options => ', options);

const putPolicy = new qiniu.rs.PutPolicy(options);

export function getUploadToken() {
  const token = putPolicy.uploadToken(mac);
  const expires = Math.floor(Date.now() / 1000 + options.expires);
  return { token, expires };
}
