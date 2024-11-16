import { Injectable } from '@nestjs/common';
import { getUploadToken } from '../common/uploads-qiniu';

@Injectable()
export class ResourceService {
  private expiresTime: number = 0;
  private token: string = '';

  generateUploadToken() {
    const timestamp = Date.now();
    if (timestamp > this.expiresTime) {
      const { token, expires } = getUploadToken();
      this.token = token;
      this.expiresTime = expires - 200;
    }
    return { token: this.token, expiresTime: this.expiresTime };
  }
}
