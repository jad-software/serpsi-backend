import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUnusualDto } from './dto/create-unusual.dto';
import { data_providers } from '../constants';
import { Repository } from 'typeorm';
import { Unusual } from './entities/unusual.entity';
import { PsychologistsService } from './psychologists.service';
import { MeetingsService } from 'src/meetings/infra/meetings.service';

@Injectable()
export class UnusualService {
  constructor(
    @Inject(data_providers.UNUSUAL_REPOSITORY)
    private unusualRepository: Repository<Unusual>,
    private psychologistService: PsychologistsService,
    private meetingService: MeetingsService
  ) { }


  async create(createUnusualDto: CreateUnusualDto) {
    try {
      const psychologist = await this.psychologistService.findOne(createUnusualDto.psychologistId, false);
      let unusuals = [];
      createUnusualDto.avaliableTimes.forEach((time) => {
        const unusual = new Unusual({
          date: createUnusualDto.date,
          startTime: time._startTime,
          endTime: time._endTime,
          psychologist: psychologist
        });
        unusuals.push(unusual);
      });
      const savedUnusuals = await this.unusualRepository.save(unusuals, { transaction: true });
      let changedSessionsNumber = 0;
      if (savedUnusuals.length === 0) {
        throw new InternalServerErrorException('Erro ao criar horários indisponíveis');
      }
      const date = new Date(createUnusualDto.date);
      console.log(date)
      await Promise.all(savedUnusuals.map(async (unusual: Unusual) => {
        const startDate = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          parseInt(unusual.startTime.split(':')[0]),
          parseInt(unusual.startTime.split(':')[1])
        );
        const endDate = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          parseInt(unusual.endTime.split(':')[0]),
          parseInt(unusual.endTime.split(':')[1])
        );
        console.log(startDate, endDate)
        changedSessionsNumber += (await this.meetingService.updateSessionsAtUnusualAgendas(createUnusualDto.psychologistId, startDate, endDate)).count;
      }));
      return { message: 'Horários indisponíveis criados com sucesso', changedSessionsNumber, unusuals: savedUnusuals };
    }
    catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findAll() {
    return await this.unusualRepository.find();
  }

  async findAllFromPsychologist(id: string) {
    return await this.unusualRepository
      .createQueryBuilder('unusual')
      .where('unusual.Psychologist_id = :id', { id })
      .addOrderBy('unusual.date', 'ASC')
      .addOrderBy('unusual.startTime', 'ASC')
      .getMany();
  }
  async remove(id: string) {
    return await this.unusualRepository.delete(id);
  }
}

