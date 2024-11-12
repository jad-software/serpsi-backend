import { Inject, Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { create } from '../application/create/create';
import { remove } from '../application/remove/remove';
import { update } from '../application/update/update';
import { getBusyDays } from '../application/getBusyDays/get-busy-days';
import { getOneSession } from '../application/getOneSession/get-one-session';
import { data_providers } from 'src/constants';
import { Repository } from 'typeorm';
import { Meeting } from '../domain/entities/meeting.entity';
import { PsychologistsService } from 'src/psychologists/psychologists.service';
import { PatientsService } from 'src/patients/patients.service';
import { StatusType } from '../domain/vo/statustype.enum';

@Injectable()
export class MeetingsService {
  constructor(
    @Inject(data_providers.MEETINGS_REPOSITORY)
    private meetingsRepository: Repository<Meeting>,
    private readonly psychologistService: PsychologistsService,
    private readonly patientService: PatientsService
  ) { }

  async create(createMeetingDto: CreateMeetingDto) {
    const meeting = new Meeting();
    meeting.schedule = createMeetingDto.schedule;
    meeting.status = StatusType.OPEN;
    try {
      const [patient, psychologist] = await Promise.all([
        this.patientService.findOne(createMeetingDto.patient),
        this.psychologistService.findOne(createMeetingDto.psychologist)
      ]);
      meeting.patient = patient;
      meeting.psychologist = psychologist;
      return await create(meeting, this.meetingsRepository);
    }
    catch (error) {
      throw error;
    }
  }

  async getBusyDays(psychologistId: string, month?: number) {
    return await getBusyDays({
      psychologistId,
      month: month ?? new Date().getMonth(),
    }, this.meetingsRepository);
  }

  async findOne(id: string) {
    return await getOneSession(id, this.meetingsRepository);
  }

  async update(id: string, updateMeetingDto: UpdateMeetingDto) {
    return await update(id, updateMeetingDto);
  }

  async remove(id: string) {
    return await remove(id);
  }
}
