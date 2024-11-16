import { ApiProperty } from '@nestjs/swagger';

export class UploadTokenDto {
  @ApiProperty({ description: '上传凭证' })
  token: string;

  @ApiProperty({ description: 'token 过期时间' })
  expiresTime: number;
}
