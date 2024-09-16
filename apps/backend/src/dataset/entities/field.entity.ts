import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Dataset } from './dataset.entity';

@Entity({ comment: '字段表' })
export class Field extends BaseEntity {
  @Column()
  dataset_code: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  fieldCode: string;

  @Column()
  valueType: string;

  @ManyToOne(() => Dataset, dataset => dataset.fields)
  dataset: Dataset;
}
