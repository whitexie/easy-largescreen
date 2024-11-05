import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { ResponseWrapper } from '../models/response.model';

const baseTypeNames = ['String', 'Number', 'Boolean'];

/**
 * @description: 生成返回结果装饰器
 */
export function ApiResult<TModel extends Type<any>>({
  type,
  status,
}: {
  type?: TModel | TModel[]
  status?: HttpStatus
}) {
  let prop: Record<string, any> = { type: 'null', default: null };

  if (Array.isArray(type)) {
    prop = {
      type: 'array',
      items: { $ref: getSchemaPath(type[0]) },
    };
  }
  else if (type) {
    if (type && baseTypeNames.includes(type.name)) {
      prop = { type: type.name.toLocaleLowerCase() };
    }
    else {
      prop = { $ref: getSchemaPath(type) };
    }
  }

  const model = Array.isArray(type) ? type[0] : type;

  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseWrapper) },
          {
            properties: {
              data: prop,
            },
          },
        ],
      },
    }),
  );
}
