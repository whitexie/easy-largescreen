import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from '../common/decorators/api-result.decorator';
import { ResponseWrapper } from '../common/models/response.model';
import { DatasetService } from './dataset.service';
import { CreateDatasetDto } from './dto/create-dataset.dto';
import { SearchDataDto } from './dto/searchData.dto';
import { Dataset } from './entities/dataset.entity';
import { Field } from './entities/field.entity';

@ApiTags('dataset')
@Controller('dataset')
@ApiExtraModels(ResponseWrapper)
export class DatasetController {
  constructor(
    private readonly datasetService: DatasetService,
  ) { }

  @Post('/createDataset')
  @ApiOperation({ summary: '创建数据集' })
  @ApiResult({ type: Dataset })
  async createDataset(@Body() createDatasetDto: CreateDatasetDto) {
    return this.datasetService.create(createDatasetDto);
  }

  @Get('/getDatasetList')
  @ApiOperation({ summary: '获取数据集列表' })
  @ApiResult({ type: [Dataset] })
  async getDatasetList() {
    return this.datasetService.findAll();
  }

  @Get('/getDatasetDetailById')
  @ApiOperation({ summary: '获取数据集详情, 含字段结构' })
  @ApiResult({ type: Dataset })
  async getDatasetDetailById(@Query('datasetId') datasetId: string) {
    return this.datasetService.findDatasetDetailById(datasetId);
  }

  @Get('/getFieldsByDatasetId')
  @ApiOperation({ summary: '获取数据集字段结构' })
  @ApiResult({ type: [Field] })
  async getFieldsByDatasetId(@Query('datasetId') datasetId: string) {
    return this.datasetService.findFieldsByDatasetId(datasetId);
  }

  @Post('/searchData')
  @ApiOperation({ summary: '获取数据集数据' })
  @ApiResult({ type: [Object] }) // TODO 这里的类型需要优化
  async searchData(@Body() params: SearchDataDto) {
    return this.datasetService.searchData(params);
  }
}
