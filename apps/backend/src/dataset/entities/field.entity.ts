import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Dataset } from './dataset.entity';

export enum ValueType {
  STRING = 'string',
  NUMBER = 'number',
  Date = 'date',
}

@Entity({ comment: '字段表' })
@Unique(['datasetCode', 'fieldCode'])
export class Field extends BaseEntity {
  @Column({ name: 'dataset_code' })
  @ApiProperty({ description: '所属表' })
  datasetCode: string;

  @Column({ name: 'field_code' })
  @ApiProperty({ description: '字段code' })
  fieldCode: string;

  @Column()
  @ApiProperty({ description: '字段名称' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '字段描述' })
  description: string;

  @Column({ type: 'enum', name: 'value_type', enum: ValueType })
  @ApiProperty({ description: '字段值类型', enum: ValueType })
  valueType: ValueType;

  @Column({ name: 'dataset_id', nullable: false })
  @ApiProperty({ description: '所属数据集ID' })
  datasetId: string;

  @ManyToOne(() => Dataset, dataset => dataset.fields)
  @JoinColumn({ name: 'dataset_id' })
  dataset: Dataset;
}
