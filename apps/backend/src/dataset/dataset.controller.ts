import { Body, Controller, Post } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { DatasetService } from './dataset.service';
import { CreateDatasetDto } from './dto/create-dataset.dto';

@Controller('dataset')
export class DatasetController {
  constructor(
    private readonly datasetService: DatasetService,
    @InjectEntityManager() private entityManager: EntityManager,
  ) { }

  @Post()
  async create(@Body() createDatasetDto: CreateDatasetDto) {
    return this.datasetService.create(createDatasetDto);
  }

  @Post('/searchData')
  async searchData(@Body() searchParams: any) {
    const { datasetId, dimensionFields, metricFields } = searchParams;

    // 构建SQL查询
    const selectFields = dimensionFields.map(field =>
      `${field.fieldCode} AS "${field.id}"`,
    ).join(', ');

    const groupByFields = dimensionFields.map(field => field.fieldCode).join(', ');

    const aggregateFunctions = metricFields.map(field =>
      `${field.calculateType}(${field.fieldCode}) AS "${field.id}"`,
    ).join(', ');

    const sql = `
      SELECT ${selectFields}, ${aggregateFunctions}
      FROM ${datasetId}
      GROUP BY ${groupByFields}
    `;

    // console.log('SQL => ', sql);
    // 执行查询
    const results = await this.entityManager.query(sql);

    return results;
  }
}
