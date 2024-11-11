import { Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { create } from '../application/create/create';
import { remove } from '../application/remove/remove';
import { update } from '../application/update/update';
import { getBusyDays } from '../application/getBusyDays/get-busy-days';
import { getOneSession } from '../application/getOneSession/get-one-session';

@Injectable()
export class MeetingsService {
  async create(createMeetingDto: CreateMeetingDto) {
    return await create(createMeetingDto);
  }

  async getBusyDays(psychologistId: string, month?: number) {
    return await getBusyDays({
      psychologistId,
      month: month ?? new Date().getMonth(),
    });
  }

  async findOne(id: string) {
    return await getOneSession(id);
  }

  async update(id: string, updateMeetingDto: UpdateMeetingDto) {
    return await update(id, updateMeetingDto);
  }

  async remove(id: string) {
    return await remove(id);
  }
}
