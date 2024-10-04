import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AgendaDto, CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { Repository } from 'typeorm';
import { Agenda } from './entities/agenda.entity';
import { data_providers } from 'src/constants';
import { TimeOfDay } from './dto/TimeOfDay.dto';
import { Day } from './vo/days.enum';
import { PsychologistsService } from './psychologists.service';
import { Psychologist } from './entities/psychologist.entity';


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

      createAgendaDto.agendas.forEach(agenda => {
        const { _day, _avaliableTimes } = agenda;
        _avaliableTimes.forEach(timeSlot => {
          const newAgenda = new Agenda({
            day: _day as Day,
            startTime: timeSlot._startTime,
            endTime: timeSlot._endTime,
          });
          newAgenda.psychologist = psychologist;
          operations.push(this.agendaRepository.save(newAgenda));
        });
      });
     const savedDays = await Promise.all(operations);
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

  async findAllFromPsychologist(id: string): Promise<Agenda[]> {
    try {
      const agendaFromPsychologist = await this.agendaRepository.createQueryBuilder('agenda')
        .leftJoinAndSelect('agenda.psychologist', 'psychologist')
        .where('psychologist.id = :id', { id })
        .select(['agenda._day', 'agenda._startTime', 'agenda._endTime', 'agenda._id._id'])
        .orderBy('agenda.day', 'ASC')
        .addOrderBy('agenda.startTime', 'ASC')
        .getMany();
      return agendaFromPsychologist;
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
      updateAgendaDto.psychologistId = id;
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
      psychologistAgendas.forEach(agenda => {
        operations.push(this.remove(agenda.id.id));
      })
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
