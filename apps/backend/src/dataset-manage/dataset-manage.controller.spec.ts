import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { DatasetManageController } from './dataset-manage.controller';

describe('datasetManageController', () => {
  let controller: DatasetManageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatasetManageController],
    }).compile();

    controller = module.get<DatasetManageController>(DatasetManageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
