import { getUploadToken } from '../index';

describe('uploads Qiniu', () => {
  it('happy test', () => {
    const { token, expires } = getUploadToken();
    // console.log('token => ', token);
    expect(typeof token).toBe('string');
    expect(expires > Date.now() / 1000).toBeTruthy();
  });
});
