import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @ApiProperty({ description: '数据Id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '数据创建时间' })
  @CreateDateColumn({ type: 'datetime' })
  created_time: Date;

  @ApiProperty({ description: '数据更新时间' })
  @UpdateDateColumn({ type: 'datetime' })
  updated_time: Date;
}
