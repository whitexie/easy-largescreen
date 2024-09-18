import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsUnique(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any[], args: ValidationArguments) {
          const seen = new Set();
          for (const item of value) {
            if (seen.has(item[args.constraints[0]])) {
              return false; // 如果发现重复，返回 false
            }
            seen.add(item[args.constraints[0]]);
          }
          return true; // 所有元素的指定属性都是唯一的
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          return `重复的${property}: ${validationArguments.value[0][property]}`;
        },
      },
    });
  };
}
