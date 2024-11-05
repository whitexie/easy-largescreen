import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/common/decorators/api-result.decorator';
import { ResponseWrapper } from '../common/models/response.model';
import { DeleteLargescreenDto, LargeScreenDetailDto, LargeScreenDto, ReleaseLargescreenDto, SaveLargescreenDto } from './dto/largescreen.dto';
import { LargescreenService } from './largescreen.service';

@ApiTags('largescreen')
@Controller('largescreen')
@ApiExtraModels(ResponseWrapper)
export class LargescreenController {
  constructor(private readonly largescreenService: LargescreenService) {}

  @Get('list')
  @ApiOperation({ summary: '大屏列表' })
  @ApiResult({ type: [LargeScreenDto] })
  list() {
    return this.largescreenService.findAll();
  }

  /**
   * 大屏详情
   * @param id
   */
  @Get('detail/:id')
  @ApiOperation({ summary: '大屏详情' })
  @ApiResult({ type: LargeScreenDetailDto })
  async detail(@Param('id') id: string) {
    return await this.largescreenService.findOne(id);
  }

  @Post('create')
  @ApiOperation({ summary: '创建大屏' })
  @ApiResult({ type: String })
  async create(@Body() data: SaveLargescreenDto) {
    // console.log('create body => ', JSON.stringify(data));
    return await this.largescreenService.create(data);
  }

  @Delete('remove')
  @ApiOperation({ summary: '删除大屏' })
  @ApiResult({ type: String })
  async remove(@Body() data: DeleteLargescreenDto) {
    // console.log('remove body => ', JSON.stringify(data));
    return await this.largescreenService.remove(data.id);
  }

  @Post('release')
  @ApiOperation({ summary: '发布大屏' })
  @ApiResult({ type: String })
  async release(@Body() data: ReleaseLargescreenDto) {
    return await this.largescreenService.release(data);
  }
}
