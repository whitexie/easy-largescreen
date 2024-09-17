import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Field, ValueType } from '../entities/field.entity';

export class CreateFieldDto extends OmitType(Field, ['id', 'datasetId', 'created_time', 'updated_time', 'dataset'] as const) {
  @IsString()
  @IsNotEmpty({ message: 'fieldCode 不能为空' })
  @ApiProperty({ description: '字段code' })
  fieldCode: string;

  @IsEnum(ValueType, { message: 'valueType 不是一个有效值' })
  @ApiProperty({ description: '字段类型', enum: ValueType })
  valueType: ValueType;
}
