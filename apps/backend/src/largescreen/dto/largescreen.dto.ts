import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { IsUnique } from '../../common/validators/IsUnique.validator';

export enum ReleaseStatus {
  UnRelease = 0,
  Release = 1,
}

class Size {
  @IsNotEmpty()
  @ApiProperty({ description: '宽度' })
  width: number;

  @IsNotEmpty()
  @ApiProperty({ description: '高度' })
  height: number;
}

class Location {
  @IsNotEmpty()
  @ApiProperty({ description: 'x' })
  x: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'y' })
  y: number;
}

class Background {
  @ApiProperty({ description: '背景颜色' })
  color: string;

  @IsUrl()
  @ApiProperty({ description: '背景图片' })
  image: string;
}

class PageConfig {
  @ApiProperty({ description: '背景配置', type: Background })
  background: Background;

  @IsNotEmpty()
  @ApiProperty({ description: '宽度' })
  width: number;

  @IsNotEmpty()
  @ApiProperty({ description: '高度' })
  height: number;
}

class Widget {
  @IsNotEmpty()
  @ApiProperty({ description: 'id' })
  id: string;

  @IsNotEmpty()
  @ApiProperty({ description: '名称' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ description: '渲染组件' })
  component: string;

  @IsNotEmpty()
  @ApiProperty({ description: '宽高', type: Size })
  size: Size;

  @IsNotEmpty()
  @ApiProperty({ description: '位置', type: Location, minItems: 2, maxItems: 2, example: [0, 0] })
  location: Location;

  @ApiProperty({ description: '组件配置' })
  @IsNotEmpty()
  props: Record<string, any>;
}

export class SaveLargescreenDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'id', required: false })
  id?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '数据集名称' })
  name: string;

  @ApiProperty({ description: '页面配置', type: PageConfig })
  @IsNotEmpty()
  pageConfig: PageConfig;

  @IsArray()
  @IsUnique('id')
  @ValidateNested({ each: true })
  @ApiProperty({ description: '页面组件', type: [Widget] })
  @Type(() => Widget)
  widgets: Widget[];
}

export class LargeScreenDetailDto extends SaveLargescreenDto {
  @ApiProperty({ description: 'id', required: true })
  id: string;

  @ApiProperty({ description: '是否发布, 1: 发布, 0: 取消发布', type: Number, enum: ReleaseStatus })
  isRelease: number;
}

export class LargeScreenDto extends OmitType(LargeScreenDetailDto, ['widgets', 'pageConfig']) {
  @Exclude()
  widgets: Widget[];

  @Exclude()
  pageConfig: PageConfig;

  constructor(partial: Partial<LargeScreenDto>) {
    super();
    Object.assign(this, partial);
  }
}

export class DeleteLargescreenDto extends PickType(LargeScreenDetailDto, ['id']) {}

export class ReleaseLargescreenDto extends PickType(LargeScreenDetailDto, ['id']) {
  @ApiProperty({ description: '是否发布, 1: 发布, 0: 取消发布', type: Number, enum: ReleaseStatus })
  @IsNotEmpty()
  @IsEnum(ReleaseStatus)
  isRelease: number;
}
