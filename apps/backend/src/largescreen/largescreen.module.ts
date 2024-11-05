import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LargeScreen } from './entities/large-screen.entity';
import { LargescreenController } from './largescreen.controller';
import { LargescreenService } from './largescreen.service';

@Module({
  imports: [TypeOrmModule.forFeature([LargeScreen])],
  providers: [LargescreenService],
  controllers: [LargescreenController],
})
export class LargescreenModule {}
