import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DatasetService } from './dataset.service';
import { CalculateType, SearchDataDto } from './dto/searchData.dto';
import { Dataset } from './entities/dataset.entity';

describe('datasetService', () => {
  let service: DatasetService;
  let mockRepository: Partial<Repository<Dataset>>;

  beforeEach(async () => {
    mockRepository = {
      manager: {
        query: jest.fn(),
        connection: {} as any,
        transaction: jest.fn(),
        repositories: {},
        treeRepositories: {},
        plainObjectToEntityTransformer: {} as any,
        callAggregateFun: jest.fn(),
        createQueryBuilder: jest.fn(),
        hasId: jest.fn(),
        getId: jest.fn(),
        // 添加其他必要的EntityManager方法
      } as unknown as EntityManager,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatasetService,
        {
          provide: getRepositoryToken(Dataset),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DatasetService>(DatasetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchData', () => {
    it('应该成功执行查询并返回结果', async () => {
      const mockSearchParams: SearchDataDto = {
        datasetId: 'test_table',
        dimensionFields: [{ id: 'dim1', fieldCode: 'field1' }],
        metricFields: [{ id: 'metric1', fieldCode: 'field2', calculateType: CalculateType.SUM }],
      };
      const mockResults = [{ dim1: 'value1', metric1: 100 }];

      (mockRepository.manager.query as jest.Mock).mockResolvedValue(mockResults);

      const result = await service.searchData(mockSearchParams);

      expect(result).toEqual(mockResults);
      expect(mockRepository.manager.query).toMatchSnapshot();
    });

    it('应该在查询失败时抛出HttpException', async () => {
      const mockSearchParams: SearchDataDto = {
        datasetId: 'test_table',
        dimensionFields: [{ id: 'dim1', fieldCode: 'field1' }],
        metricFields: [{ id: 'metric1', fieldCode: 'field2', calculateType: CalculateType.SUM }],
      };

      (mockRepository.manager.query as jest.Mock).mockRejectedValue({ sqlMessage: 'Database error' });

      await expect(service.searchData(mockSearchParams)).rejects.toThrow(HttpException);
      await expect(service.searchData(mockSearchParams)).rejects.toThrow('Database error');
    });

    it('应该正确处理多个维度和指标字段', async () => {
      const mockSearchParams: SearchDataDto = {
        datasetId: 'test_table',
        dimensionFields: [
          { id: 'dim1', fieldCode: 'field1' },
          { id: 'dim2', fieldCode: 'field2' },
        ],
        metricFields: [
          { id: 'metric1', fieldCode: 'field3', calculateType: CalculateType.SUM },
          { id: 'metric2', fieldCode: 'field4', calculateType: CalculateType.AVG },
        ],
      };
      const mockResults = [{ dim1: 'value1', dim2: 'value2', metric1: 100, metric2: 50 }];

      (mockRepository.manager.query as jest.Mock).mockResolvedValue(mockResults);

      const result = await service.searchData(mockSearchParams);

      expect(result).toEqual(mockResults);
      expect(mockRepository.manager.query).toMatchSnapshot();
      expect(mockRepository.manager.query).toMatchSnapshot();
    });
  });
});
