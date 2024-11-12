import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { FindBusyDaysDAO } from '../application/getBusyDays/findBusyDays.dao';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('meetings')
@ApiBearerAuth()
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  async create(@Body() createMeetingDto: CreateMeetingDto) {
    return await this.meetingsService.create(createMeetingDto);
  }

  @Get()
  async getAllBusyDays(@Query() search: FindBusyDaysDAO) {
    return await this.meetingsService.getBusyDays(
      search.psychologistId,
      search.month
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.meetingsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto
  ) {
    return await this.meetingsService.update(id, updateMeetingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.meetingsService.remove(id);
  }
}
