import { Module } from '@nestjs/common';
import { MeetingsService } from './infra/meetings.service';
import { MeetingsController } from './infra/meetings.controller';

@Module({
  controllers: [MeetingsController],
  providers: [MeetingsService],
})
export class MeetingsModule {}
