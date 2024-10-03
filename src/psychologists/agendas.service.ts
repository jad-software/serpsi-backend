import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { Repository } from 'typeorm';
import { Agenda } from './entities/agenda.entity';
import { data_providers } from 'src/constants';

@Injectable()
export class AgendasService {
  constructor(
    @Inject(data_providers.AGENDA_REPOSITORY) private agendaRepository: Repository<Agenda>
  ) { }
  async create(createAgendasDto: CreateAgendaDto[]) {
    try{
      let agendasSaved = [];
      for (const createAgendaDto of createAgendasDto) {
        const agenda = new Agenda({
          day: createAgendaDto.day, 
          startTime: createAgendaDto.startTime, 
          endTime: createAgendaDto.endTime 
        })
        const agendaSaved  =  await this.agendaRepository.save(agenda);
        agendasSaved.push(agendaSaved)
      }
    
      return agendasSaved;
    }
    catch(err) {
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
