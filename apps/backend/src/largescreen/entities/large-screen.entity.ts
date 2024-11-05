import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

interface WidgetSize {
  width: number
  height: number
}

interface WidgetLocation {
  x: number
  y: number
}

interface Widget {
  id: string
  name: string
  component: string
  size: WidgetSize
  location: WidgetLocation
  props: Record<string, any>
}

interface Background {
  color: string
  image: string
}

export interface PageConfig {
  background: Background
  width: number
  height: number
}

export interface LargeScreenConfig {
  pageConfig: PageConfig
  widgets: Widget[]
}

@Entity({ name: 'large_screen', comment: '数据大屏' })
export class LargeScreen extends BaseEntity {
  @Column({ name: 'name', comment: '页面名称' })
  @ApiProperty({ description: '页面名称' })
  name: string;

  @Column({ name: 'widgets', comment: '页面组件', type: 'simple-json' })
  @ApiProperty({ description: '页面组件' })
  widgets: Widget[];

  @Column({ name: 'page_config', comment: '页面配置', type: 'simple-json' })
  @ApiProperty({ description: '页面配置' })
  pageConfig: PageConfig;

  @Column({ name: 'is_release', type: 'int', comment: '状态', default: 0 })
  @ApiProperty({ description: '是否发布' })
  isRelease: number;
}
