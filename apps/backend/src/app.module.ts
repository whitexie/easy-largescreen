import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSourceOptions } from '../ormConfig';
import { DatasetModule } from './dataset/dataset.module';
import { LargescreenModule } from './largescreen/largescreen.module';
import { ResourceModule } from './resource/resource.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSourceOptions),
    DatasetModule,
    LargescreenModule,
    ResourceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
