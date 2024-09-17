import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let errorCode = 500;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
      else if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        if (Array.isArray(exceptionResponse.message)) {
          message = exceptionResponse.message.join(',');
        }
        else {
          message = exceptionResponse.message as string;
        }
      }
      // message = typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message || '未知错误';
      errorCode = status;
    }

    response.status(status).json({
      error: errorCode,
      msg: message,
      data: null,
    });
  }
}
