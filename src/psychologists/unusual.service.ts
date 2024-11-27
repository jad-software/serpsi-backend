import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUnusualDto } from './dto/create-unusual.dto';
import { data_providers } from 'src/constants';
import { Repository } from 'typeorm';
import { Unusual } from './entities/unusual.entity';
import { PsychologistsService } from './psychologists.service';

@Injectable()
export class UnusualService {
  constructor(
    @Inject(data_providers.UNUSUAL_REPOSITORY)
    private unusualRepository: Repository<Unusual>,
    private psychologistService: PsychologistsService,
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
      return await this.unusualRepository.save(unusuals, { transaction: true });
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
