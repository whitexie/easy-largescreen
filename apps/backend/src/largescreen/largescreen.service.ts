import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sendResponse } from 'src/common/models/response.model';
import { Repository } from 'typeorm';
import { LargeScreenDto, ReleaseLargescreenDto, ReleaseStatus, SaveLargescreenDto } from './dto/largescreen.dto';
import { LargeScreen } from './entities/large-screen.entity';

@Injectable()
export class LargescreenService {
  constructor(
    @InjectRepository(LargeScreen)
    private largeScreenRepository: Repository<LargeScreen>,
  ) {}

  async findAll() {
    const data = await this.largeScreenRepository.find({
      select: {
        id: true,
        name: true,
        isRelease: true,
        created_time: true,
        updated_time: true,
      },
      order: {
        updated_time: 'DESC',
      },
    });
    return data.map(item => new LargeScreenDto(item));
  }

  async findOne(id: string) {
    const data = await this.largeScreenRepository.findOneBy({ id });
    return data;
  }

  async create(body: SaveLargescreenDto) {
    // console.log('create service body => ', JSON.stringify(body));
    if (body?.id) {
      const record = await this.largeScreenRepository.findOne({ where: { id: body.id } });
      record.name = body.name;
      record.pageConfig = body.pageConfig;
      record.widgets = body.widgets;
      await this.largeScreenRepository.save(record);

      return { id: record.id };
    }

    let data = this.largeScreenRepository.create(body);
    data = await this.largeScreenRepository.save(data);

    return { id: data.id };
  }

  async remove(id: string) {
    const ret = await this.largeScreenRepository.delete({ id });

    if (ret.affected === 0) {
      return sendResponse(400, '未找到要删除的记录');
    }

    return sendResponse(0, '删除成功');
  }

  async release(data: ReleaseLargescreenDto) {
    const ret = await this.largeScreenRepository.update({ id: data.id }, { isRelease: data.isRelease });
    if (ret.affected === 0) {
      return sendResponse(400, '未找到要发布的记录');
    }

    return sendResponse(0, data.isRelease === ReleaseStatus.Release ? '发布成功' : '取消发布成功');
  }
}
