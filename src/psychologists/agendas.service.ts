import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AgendaDto, CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { Repository } from 'typeorm';
import { Agenda } from './entities/agenda.entity';
import { data_providers } from '../constants';
import { Day } from './vo/days.enum';
import { PsychologistsService } from './psychologists.service';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';

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

      const updatePsychologist = {
        meetValue: createAgendaDto.meetValue,
        meetDuration: createAgendaDto.meetDuration,
      } as UpdatePsychologistDto;

      psychologist.meetDuration = updatePsychologist.meetDuration;
      psychologist.meetValue = updatePsychologist.meetValue;

      createAgendaDto.agendas.forEach((agenda) => {
        const { _day, _avaliableTimes } = agenda;
        _avaliableTimes.forEach((timeSlot) => {
          const newAgenda = new Agenda({
            day: _day as Day,
            startTime: timeSlot._startTime,
            endTime: timeSlot._endTime,
          });
          newAgenda.psychologist = psychologist;
          operations.push(this.agendaRepository.save(newAgenda));
        });
      });

      await this.psychologistService.update(
        psychologist.id.id,
        updatePsychologist
      );
      const savedDays = await Promise.all(operations);
      return savedDays;
    } catch (err) {
      throw new InternalServerErrorException('problemas ao adicionar as agendas');
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

  async findAllFromPsychologist(id: string): Promise<CreateAgendaDto> {
    try {
      const agendaFromPsychologist = await this.agendaRepository
        .createQueryBuilder('agenda')
        .where('psychologist_id = :id', { id })
        .select([
          'agenda._day',
          'agenda._startTime',
          'agenda._endTime',
          'agenda._id._id',
        ])
        .addOrderBy('agenda.startTime', 'ASC')
        .getMany();

      const psychologist = await this.psychologistService.findOne(id);

      const groupedAgendas = agendaFromPsychologist.reduce(
        (result, current) => {
          const { day, startTime, endTime, id } = current; // Propriedade correta é 'day'

          if (!result[day]) {
            result[day] = {
              _day: day,
              _avaliableTimes: [],
            };
          }

          result[day]._avaliableTimes.push({
            _startTime: startTime,
            _endTime: endTime,
            id: id.id,
          });

          return result;
        },
        {} as { [key: string]: AgendaDto }
      );

      const formattedAgendas = Object.values(groupedAgendas);
      return {
        psychologistId: id,
        meetDuration: psychologist.meetDuration,
        meetValue: psychologist.meetValue,
        agendas: formattedAgendas,
      };
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async FindOne(id: string): Promise<Agenda> {
    try {
      const agenda = await this.agendaRepository
        .createQueryBuilder('agenda')
        .where('agenda.id = :id', { id })
        .getOneOrFail();
      return agenda;
    } catch (err) {
      throw new NotFoundException('agenda não encontrada');
    }
  }

  async update(id: string, updateAgendaDto: UpdateAgendaDto) {
    try {
      await this.removeAllFromPsychologist(id);
      updateAgendaDto.psychologistId = id;
      const savedAgenda = await this.create(updateAgendaDto as CreateAgendaDto);
      return savedAgenda;
    } catch (err) {
      throw new InternalServerErrorException('problema no update de agenda');
    }
  }

  async removeAllFromPsychologist(id: string) {
    try {
      const operations = [];
      const psychologistAgendas = await this.findAllFromPsychologist(id);

      psychologistAgendas.agendas.forEach((agenda) => {
        agenda._avaliableTimes.forEach((timeOfDay) => {
          operations.push(this.remove(timeOfDay.id));
        });
      });
      await Promise.allSettled(operations);
    } catch (err) {
      throw new InternalServerErrorException('problema na deleção das agendas');
    }
  }

  async remove(id: string) {
    try {
      const agenda = await this.FindOne(id);
      await this.agendaRepository.remove(agenda);
    } catch (err) {
      throw new InternalServerErrorException('problemas ao remover agenda');
    }
  }
}
