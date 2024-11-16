import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from '../common/decorators/api-result.decorator';
import { UploadTokenDto } from './dto/resource.dto';
import { ResourceService } from './resource.service';

@Controller('resource')
@ApiTags('Resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post('getUploadToken')
  @ApiOperation({ summary: '获取上传凭证' })
  @ApiResult({ type: UploadTokenDto })
  getUploadToken() {
    return this.resourceService.generateUploadToken();
  }
}
