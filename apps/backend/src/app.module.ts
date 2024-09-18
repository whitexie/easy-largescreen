import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSourceOptions } from '../ormConfig';
import { DatasetModule } from './dataset/dataset.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSourceOptions),
    DatasetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
