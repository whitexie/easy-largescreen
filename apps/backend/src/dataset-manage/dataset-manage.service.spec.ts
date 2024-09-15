import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { DatasetManageService } from './dataset-manage.service';

describe('datasetManageService', () => {
  let service: DatasetManageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatasetManageService],
    }).compile();

    service = module.get<DatasetManageService>(DatasetManageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
