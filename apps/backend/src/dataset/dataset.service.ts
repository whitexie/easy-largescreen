import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDatasetDto } from './dto/create-dataset.dto';
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
}
