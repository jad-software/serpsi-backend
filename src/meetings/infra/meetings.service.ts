import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { create } from '../application/create/create';
import { remove } from '../application/remove/remove';
import { update } from '../application/update/update';
import { getBusyDays } from '../application/getBusyDays/get-busy-days';
import { getOneSession } from '../application/getOneSession/get-one-session';
import { data_providers } from '../../constants';
import { Repository } from 'typeorm';
import { Meeting } from '../domain/entities/meeting.entity';
import { PsychologistsService } from '../../psychologists/psychologists.service';
import { PatientsService } from '../../patients/patients.service';
import { getSchedule } from '../application/getSchedule/get-schedule';
import { modifyStatus } from '../application/modifyStatus/modify-status';
import { UpdateStatusDto } from './dto/update-status.dto';
import { createManySessions } from '../application/create/create-many-sessions';
import { FrequencyEnum } from './dto/frequency.enum';
import { numberToDay } from '../../psychologists/vo/days.enum';
import { checkAvaliableTime } from '../application/checkAvaliableTime/check-avaliable-time';
import { DocumentsService } from '../../documents/documents.service';
import { FindBusyDaysDAO } from '../application/getBusyDays/findBusyDays.dao';

@Injectable()
export class MeetingsService {
  constructor(
    @Inject(data_providers.MEETINGS_REPOSITORY)
    private meetingsRepository: Repository<Meeting>,
    private readonly psychologistService: PsychologistsService,
    @Inject(forwardRef(() => PatientsService))
    private readonly patientService: PatientsService,
    @Inject(forwardRef(() => DocumentsService))
    private readonly documentsService: DocumentsService
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

  async getBusyDays(search: FindBusyDaysDAO) {
    return await getBusyDays(search, this.meetingsRepository);
  }

  async AvaliableTimes(psychologistId: string, startDate: Date) {
    let days = numberToDay(startDate.getDay() + 1);

    const [schedule, times, unusuals] = await Promise.all([
      getSchedule({ psychologistId, startDate, isEntity: true }, this.meetingsRepository),
      this.psychologistService.getTimes(psychologistId, days),
      this.psychologistService.getUnusualTimes(psychologistId, startDate)
    ])
    return await checkAvaliableTime(times, schedule, unusuals);
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
    const meeting = await getOneSession(id, this.meetingsRepository, true);
    try {
      let promiseDocuments = []
      meeting.documents.forEach((document) => {
        promiseDocuments.push(this.documentsService.remove(document.id.id));
      });
      await Promise.all(promiseDocuments);
      return await remove(id, this.meetingsRepository);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
