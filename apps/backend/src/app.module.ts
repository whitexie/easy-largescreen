import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSourceOptions } from '../ormConfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatasetModule } from './dataset/dataset.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSourceOptions),
    DatasetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
