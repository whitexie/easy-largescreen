import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export enum CalculateType {
  SUM = 'sum',
  AVG = 'avg',
  COUNT = 'count',
}

class FieldDto {
  @IsNotEmpty()
  @IsString()
  fieldCode: string;

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  valueType?: string;

  @IsOptional()
  @IsString()
  fieldType?: string;

  @IsOptional()
  @IsString()
  datasetId?: string;
}

class MetricFieldDto extends FieldDto {
  @IsNotEmpty()
  @IsEnum(CalculateType)
  calculateType: CalculateType;
}

export class SearchDataDto {
  @IsNotEmpty()
  @IsString()
  datasetId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  dimensionFields: FieldDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetricFieldDto)
  metricFields: MetricFieldDto[];
}
