import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { getSchedule } from '../application/getSchedule/get-schedule';
import { modifyStatus } from '../application/modifyStatus/modify-status';
import { UpdateStatusDto } from './dto/update-status.dto';
import { createManySessions } from '../application/create/create-many-sessions';
import { FrequencyEnum } from './dto/frequency.enum';
import { Day, numberToDay } from 'src/psychologists/vo/days.enum';
import { checkAvaliableTime } from '../application/checkAvaliableTime/check-avaliable-time';

@Injectable()
export class MeetingsService {
  constructor(
    @Inject(data_providers.MEETINGS_REPOSITORY)
    private meetingsRepository: Repository<Meeting>,
    private readonly psychologistService: PsychologistsService,
    @Inject(forwardRef(() => PatientsService))
    private readonly patientService: PatientsService
  ) { }

  async create(createMeetingDto: CreateMeetingDto) {
    const meeting = new Meeting(createMeetingDto);
    try {
      const [patient, psychologist] = await Promise.all([
        this.patientService.findOne(createMeetingDto.patient, false),
        this.psychologistService.findOne(createMeetingDto.psychologist, false)
      ]);
      meeting.patient = patient;
      meeting.psychologist = psychologist;
      if (createMeetingDto.quantity === 1 || createMeetingDto.frequency === FrequencyEnum.AVULSO) {
        return await create(meeting, this.meetingsRepository);
      }
      return await createManySessions(meeting, createMeetingDto.frequency, createMeetingDto.quantity, this.meetingsRepository);
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

  async AvaliableTimes(psychologistId: string, startDate: Date) {
    let days = numberToDay(startDate.getDay() + 1);

    const [schedule, times] = await Promise.all([
      getSchedule({ psychologistId, startDate, isEntity: true }, this.meetingsRepository),
      this.psychologistService.getTimes(psychologistId, days)
    ])
    return await checkAvaliableTime(times, schedule);
  }

  async findOne(id: string, relations: boolean = true) {
    return await getOneSession(id, this.meetingsRepository, relations);
  }

  async getSessionsByInterval(psychologistId: string, startDate: Date, endDate: Date) {
    return await getSchedule({ psychologistId, startDate, endDate }, this.meetingsRepository);
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
