import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Generated, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Field } from './field.entity';

@Entity({ comment: '数据集' })
export class Dataset extends BaseEntity {
  @Column()
  @ApiProperty({ description: '数据集名称' })
  name: string;

  @Column({ name: 'dataset_code', unique: true })
  @ApiProperty({ description: '数据集对应的数据表' })
  @Generated('uuid')
  datasetCode: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '数据集描述', required: false })
  description: string;

  @OneToMany(() => Field, field => field.dataset)
  @ApiProperty({ description: '数据集字段', type: [Field] })
  fields: Field[];
}
