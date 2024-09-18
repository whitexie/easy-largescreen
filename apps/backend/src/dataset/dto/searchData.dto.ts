import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  fieldCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  valueType: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  fieldType: string;
}

class MetricFieldDto extends FieldDto {
  @IsNotEmpty()
  @IsEnum(CalculateType)
  @ApiProperty()
  calculateType: CalculateType;
}

export class SearchDataDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  datasetId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  @ApiProperty({ type: [FieldDto] })
  dimensionFields: FieldDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetricFieldDto)
  @ApiProperty({ type: [MetricFieldDto] })
  metricFields: MetricFieldDto[];
}
