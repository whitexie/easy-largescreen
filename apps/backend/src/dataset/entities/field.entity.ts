import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
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
  datasetCode: string;

  @Column({ name: 'field_code' })
  fieldCode: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', name: 'value_type', enum: ValueType })
  valueType: ValueType;

  @Column({ name: 'dataset_id', nullable: false })
  datasetId: string;

  @ManyToOne(() => Dataset, dataset => dataset.fields)
  @JoinColumn({ name: 'dataset_id' })
  dataset: Dataset;
}
