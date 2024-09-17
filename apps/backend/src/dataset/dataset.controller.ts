import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

  @Post('/createDataset')
  async create(@Body() createDatasetDto: CreateDatasetDto) {
    return this.datasetService.create(createDatasetDto);
  }

  @Get('/getDatasetList')
  async getDatasetList() {
    return this.datasetService.findAll();
  }

  @Get('/getDatasetDetailById')
  async getDatasetDetailById(@Query('datasetId') datasetId: string) {
    return this.datasetService.findDatasetDetailById(datasetId);
  }

  @Get('/getFieldsByDatasetId')
  async getFieldsByDatasetId(@Query('datasetId') datasetId: string) {
    return this.datasetService.findFieldsByDatasetId(datasetId);
  }

  @Post('/searchData')
  async searchData(@Body() params: SearchDataDto) {
    return this.datasetService.searchData(params);
  }
}
