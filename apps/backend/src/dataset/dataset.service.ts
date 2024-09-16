import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDatasetDto } from './dto/create-dataset.dto';
import { SearchDataDto } from './dto/searchData.dto';
import { Dataset } from './entities/dataset.entity';

@Injectable()
export class DatasetService {
  constructor(
    @InjectRepository(Dataset)
    private datasetRepository: Repository<Dataset>,
  ) {}

  async create(createDatasetDto: CreateDatasetDto): Promise<Dataset> {
    const dataset = this.datasetRepository.create(createDatasetDto);
    return this.datasetRepository.save(dataset);
  }

  async searchData(searchParams: SearchDataDto) {
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
    let results;
    try {
      results = await this.datasetRepository.manager.query(sql);
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.sqlMessage,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return results;
  }
}
