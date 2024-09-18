import { ApiProperty } from '@nestjs/swagger';

export class ResponseWrapper<T = Record<string, any> | any[]> {
  @ApiProperty({ type: 'object' })
  data?: T;

  @ApiProperty({ type: 'number', default: 0 })
  error: number;

  @ApiProperty({ type: 'string', default: 'success' })
  msg: string;

  constructor(code: number, data: T, message = 'success') {
    this.error = code;
    this.data = data;
    this.msg = message;
  }
}
