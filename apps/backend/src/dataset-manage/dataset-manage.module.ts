import { Module } from '@nestjs/common';
import { DatasetManageController } from './dataset-manage.controller';
import { DatasetManageService } from './dataset-manage.service';

@Module({
  controllers: [DatasetManageController],
  providers: [DatasetManageService],
})
export class DatasetManageModule {}
