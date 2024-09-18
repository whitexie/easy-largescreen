import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IsUnique } from '../../common/validators/IsUnique.validator';
import { CreateFieldDto } from './create-field.dto';

export class CreateDatasetDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '数据集名称' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '数据集描述', required: false })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '数据集code' })
  datasetCode: string;

  @ApiProperty({ description: '数据集字段', type: [CreateFieldDto] })
  @IsArray()
  @ArrayMinSize(1, { message: '数据集字段不能少于1个' })
  @IsNotEmpty()
  @IsUnique('fieldCode')
  @ValidateNested({ each: true })
  @Type(() => CreateFieldDto)
  fields: CreateFieldDto[];
}
