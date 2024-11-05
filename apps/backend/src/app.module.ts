import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSourceOptions } from '../ormConfig';
import { DatasetModule } from './dataset/dataset.module';
import { LargescreenModule } from './largescreen/largescreen.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSourceOptions),
    DatasetModule,
    LargescreenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
