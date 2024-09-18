import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseWrapper } from 'src/common/models/response.model';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseWrapper<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseWrapper<T>> {
    return next.handle().pipe(
      map(data => new ResponseWrapper(0, data ?? null, 'ok')),
    );
  }
}
