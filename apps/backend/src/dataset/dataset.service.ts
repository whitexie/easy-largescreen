import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateDatasetDto } from './dto/create-dataset.dto';
import { SearchDataDto } from './dto/searchData.dto';
import { Dataset } from './entities/dataset.entity';
import { Field } from './entities/field.entity';

@Injectable()
export class DatasetService {
  constructor(
    @InjectRepository(Dataset)
    private datasetRepository: Repository<Dataset>,
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
    private dataSource: DataSource,
  ) {}

  async create(createDatasetDto: CreateDatasetDto): Promise<Dataset> {
    // 检查 datasetCode 是否已存在
    const isDatasetExists = await this.datasetRepository.existsBy({ datasetCode: createDatasetDto.datasetCode });
    if (isDatasetExists) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'datasetCode 已存在',
      }, HttpStatus.BAD_REQUEST);
    }
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      // 创建并保存 dataset
      let dataset = transactionalEntityManager.create(Dataset, createDatasetDto);
      dataset = await transactionalEntityManager.save(dataset);

      // 创建并保存 fields
      const fieldEntities: Field[] = createDatasetDto.fields.map((field) => {
        const fieldOptions = {
          ...field,
          datasetId: dataset.id.toString(),
          datasetCode: dataset.datasetCode,
        };
        return transactionalEntityManager.create(Field, fieldOptions);
      });

      await transactionalEntityManager.save(fieldEntities);

      // 将 fields 关联到 dataset
      dataset.fields = fieldEntities;

      return dataset;
    });
  }

  async findAll(): Promise<Dataset[]> {
    return this.datasetRepository.find();
  }

  async findFieldsByDatasetId(datasetId: string): Promise<Field[]> {
    return this.fieldRepository.find({ where: { datasetId } });
  }

  async findDatasetDetailById(datasetId: string): Promise<Dataset> {
    const dataset = await this.datasetRepository.findOne({ where: { id: datasetId } });
    dataset.fields = await this.findFieldsByDatasetId(datasetId);
    return dataset;
  }

  async searchData(searchParams: SearchDataDto) {
    const { datasetId, dimensionFields, metricFields } = searchParams;

    const dataset = await this.datasetRepository.findOneBy({ id: datasetId });

    if (!dataset) {
      throw new HttpException('datasetId not fnound', HttpStatus.BAD_REQUEST);
    }

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
      FROM ${dataset.datasetCode}
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

    results.forEach((row) => {
      metricFields.forEach((metricField) => {
        row[metricField.id] = Number(row[metricField.id]);
      });
    });

    return results;
  }
}
