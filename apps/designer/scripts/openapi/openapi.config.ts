import { generateService } from '@umijs/openapi';

/**
 * operationId format example: `@Controller('dataset') => DatasetController_${FunctionName}`
 */
const re = /.+?controller[-_ .](\w)/gi;

generateService({
  schemaPath: 'http://localhost:3000/swagger-json',
  serversPath: './src',
  apiPrefix: '"/api"',
  requestOptionsType: 'Record<string, any>',
  templatesFolder: './scripts/openapi/templates',
  // 自定义网络请求函数路径
  requestImportStatement: `
  /**
   * 该文件为 @umijs/openapi 插件自动生成，请勿随意修改。如需修改请通过配置 openapi.config.ts 进行定制化。
   * */

  import { request } from "@/utils";
  `,
  hook: {
    // @ts-expect-error 缺少类型定义
    customFunctionName(operationObject, apiPath) {
      const { operationId } = operationObject;

      if (!operationId) {
        console.warn('[Warning] no operationId', apiPath);
        return;
      }

      const funcName = operationId.replace(re, (_all, letter) => {
        const r = letter.toUpperCase();
        return r;
      });

      operationObject.operationId = funcName;
      return funcName;
    },
    // customType(schemaObject, namespace, defaultGetType) {
    //   const type = defaultGetType(schemaObject, namespace);

    //   console.log('params => ', schemaObject, namespace, type);
    //   // 提取出 data 的类型
    //   const regex = /API\.ResOp & \{ 'data'\?: (.+); \}/;
    //   const result = type.replace(regex, '$1');
    //   console.log('result => ', result);
    //   return result;
    // },
  },
});
