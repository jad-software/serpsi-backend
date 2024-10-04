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
      for (const day in createAgendaDto.days) {
        if (Object.prototype.hasOwnProperty.call(createAgendaDto.days, day)) {
          const timeSlots: TimeOfDay[] = createAgendaDto.days[day];

          console.log(`Horários para ${day}:`);
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

  async findAllFromPsychologist(id: string) {
    try {
      const agendaFromPsychologist = await this.agendaRepository.createQueryBuilder('agenda')
        .leftJoinAndSelect('agenda.psychologist', 'psychologist')
        .where('psychologist.id = :id', { id })
        .select(['agenda._day', 'agenda._startTime', 'agenda._endTime'])
        .orderBy('agenda.day', 'ASC')
        .addOrderBy('agenda.startTime', 'ASC')
        .getMany();

      const agendaGroupedByDay = agendaFromPsychologist.reduce((result, current) => {
        const {day, startTime, endTime} = current;
        if(!result[day] ){
          result[day] = []
        }
        result[day].push({ startTime, endTime});
        return result;
      }, {})
  
      return agendaGroupedByDay;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  update(id: number, updateAgendaDto: UpdateAgendaDto) {
    return `This action updates a #${id} agenda`;
  }

  remove(id: number) {
    return `This action removes a #${id} agenda`;
  }
}
