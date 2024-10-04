import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { Repository } from 'typeorm';
import { Agenda } from './entities/agenda.entity';
import { data_providers } from 'src/constants';
import { TimeOfDay } from './dto/TimeOfDay.dto';
import { Day } from './vo/days.enum';
import { PsychologistsService } from './psychologists.service';
import { Psychologist } from './entities/psychologist.entity';
import { GroupedAgenda, IDay } from './interfaces/groupByDays.interface';


@Injectable()
export class AgendasService {
  constructor(
    @Inject(data_providers.AGENDA_REPOSITORY)
    private agendaRepository: Repository<Agenda>,
    @Inject(forwardRef(() => PsychologistsService))
    private psychologistService: PsychologistsService
  ) { }
  async create(createAgendaDto: CreateAgendaDto) {
    const operations = [];
    try {
      const psychologist = await this.psychologistService.findOne(
        createAgendaDto.psychologistId
      );
      await this.removeAllFromPsychologist(psychologist.id.id);
      for (const day in createAgendaDto.days) {
        if (Object.prototype.hasOwnProperty.call(createAgendaDto.days, day)) {
          const timeSlots: TimeOfDay[] = createAgendaDto.days[day];

          timeSlots.forEach((slot) => {
            const agenda = new Agenda({
              day: day as Day,
              startTime: slot.initialTime,
              endTime: slot.endTime,
            });
            agenda.psychologist = psychologist;
            operations.push(this.agendaRepository.save(agenda));
          });
        }
      }
      const allPromises = Promise.all(operations);
      const savedDays = await allPromises;
      return savedDays;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async findAll(): Promise<Agenda[]> {
    try {
      const agendas = await this.agendaRepository
        .createQueryBuilder('agenda')
        .getMany();
      return agendas;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async findAllFromPsychologist(id: string): Promise<GroupedAgenda> {
    try {
      const agendaFromPsychologist = await this.agendaRepository.createQueryBuilder('agenda')
        .leftJoinAndSelect('agenda.psychologist', 'psychologist')
        .where('psychologist.id = :id', { id })
        .select(['agenda._day', 'agenda._startTime', 'agenda._endTime', 'agenda._id._id'])
        .orderBy('agenda.day', 'ASC')
        .addOrderBy('agenda.startTime', 'ASC')
        .getMany();
      const agendaGroupedByDay = agendaFromPsychologist.reduce((result, current) => {
        const { day, startTime, endTime, id } = current;
        if (!result[day]) {
          result[day] = []
        }
        result[day].push({ startTime, endTime, id });
        return result;
      }, {} as GroupedAgenda)

      return agendaGroupedByDay;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async FindOne(id: string): Promise<Agenda> {
    try {
      const agenda = await this.agendaRepository.createQueryBuilder('agenda')
        .where('agenda.id = :id', { id })
        .getOneOrFail();
      return agenda;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
  
  async update(id: string, updateAgendaDto: UpdateAgendaDto) {
    try {
      await this.removeAllFromPsychologist(id);
      const savedAgenda = await this.create(updateAgendaDto as CreateAgendaDto);
      return savedAgenda;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async removeAllFromPsychologist(id: string) {
    try {
      const operations = [];
      const psychologistAgendas = await this.findAllFromPsychologist(id);
      for (const day in psychologistAgendas) {
        const dayArray = psychologistAgendas[day as keyof GroupedAgenda];
        if (dayArray) {
          dayArray.forEach((dayItem) => {
            operations.push(this.remove(dayItem.id.id))
          });
        }
      }
      await Promise.allSettled(operations);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async remove(id: string) {
    try {
      const agenda = await this.FindOne(id);
      await this.agendaRepository.remove(agenda);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
}
