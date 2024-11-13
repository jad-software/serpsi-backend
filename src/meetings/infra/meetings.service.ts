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
import { getSchedule } from '../application/getSchedule/get-schedule';
import { modifyStatus } from '../application/modifyStatus/modify-status';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class MeetingsService {
  constructor(
    @Inject(data_providers.MEETINGS_REPOSITORY)
    private meetingsRepository: Repository<Meeting>,
    private readonly psychologistService: PsychologistsService,
    private readonly patientService: PatientsService
  ) { }

  async create(createMeetingDto: CreateMeetingDto) {
    const meeting = new Meeting(createMeetingDto);
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

  async getSessionsByInterval(psychologistId: string, startDate: Date, endDate: Date) {
    return await getSchedule(psychologistId, this.meetingsRepository, startDate, endDate);
  }

  async update(id: string, updateMeetingDto: UpdateMeetingDto) {
    return await update(id, updateMeetingDto, this.meetingsRepository);
  }

  async updateStatus(id: string, newStatus: UpdateStatusDto) {
    return await modifyStatus(id, newStatus.status, this.meetingsRepository);
  }

  async remove(id: string) {
    return await remove(id, this.meetingsRepository);
  }
}
