import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { Repository } from 'typeorm';
import { Agenda } from './entities/agenda.entity';
import { data_providers } from 'src/constants';
import { TimeOfDay } from './dto/TimeOfDay.dto';
import { Day } from './vo/days.enum';

@Injectable()
export class AgendasService {
  constructor(
    @Inject(data_providers.AGENDA_REPOSITORY) private agendaRepository: Repository<Agenda>
  ) { }
  async create(createAgendaDto: CreateAgendaDto) {
    const operations = [];
    try {
      for (const day in createAgendaDto.days) {
        if (Object.prototype.hasOwnProperty.call(createAgendaDto.days, day)) {
          const timeSlots: TimeOfDay[] = createAgendaDto.days[day];

          console.log(`Horários para ${day}:`);
          timeSlots.forEach((slot) => {
            const agenda = new Agenda({
              day: day as Day,
              startTime: slot.initialTime,
              endTime: slot.endTime
            });
            operations.push(this.agendaRepository.save(agenda))

          });
        }
      }
      const allPromises =  Promise.all(operations);
      const savedDays = await allPromises;
      return savedDays;
    }
    catch (err) {
      throw new BadRequestException(err?.message);
    }

  }

  findAll() {
    return `This action returns all agendas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} agenda`;
  }

  update(id: number, updateAgendaDto: UpdateAgendaDto) {
    return `This action updates a #${id} agenda`;
  }

  remove(id: number) {
    return `This action removes a #${id} agenda`;
  }
}
