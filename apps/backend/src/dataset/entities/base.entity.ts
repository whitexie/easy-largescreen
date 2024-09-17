import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'datetime' })
  created_time: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_time: Date;
}
