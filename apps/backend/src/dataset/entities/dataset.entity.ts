import { Column, Entity, Generated, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Field } from './field.entity';

@Entity({ comment: '数据集' })
export class Dataset extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'dataset_code', unique: true })
  @Generated('uuid')
  datasetCode: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Field, field => field.dataset)
  fields: Field[];
}
