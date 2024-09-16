import { Body, Controller, Post } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { DatasetService } from './dataset.service';
import { CreateDatasetDto } from './dto/create-dataset.dto';
import { SearchDataDto } from './dto/searchData.dto';

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
  async searchData(@Body() params: SearchDataDto) {
    return this.datasetService.searchData(params);
  }
}
