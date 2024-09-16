import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateDatasetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsObject()
  @IsNotEmpty()
  data: any;
}
