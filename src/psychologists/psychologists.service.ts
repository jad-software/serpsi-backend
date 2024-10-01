import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreatePsychologistDto } from './dto/create-psychologist.dto';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';
import { data_providers } from 'src/constants';
import { Repository } from 'typeorm';
import { Psychologist } from './entities/psychologist.entity';
import { UsersService } from '../users/users.service';
import { PersonsService } from '../persons/persons.service';
import { Crp } from './vo/crp.vo';

@Injectable()
export class PsychologistsService {
  constructor(
    @Inject(data_providers.PSYCHOLOGISTS_REPOSITORY)
    private psychologistsRepository: Repository<Psychologist>,
    @Inject()
    private usersService: UsersService,
    @Inject()
    private personsService: PersonsService
  ) { }

  async create(createPsychologistDto: CreatePsychologistDto) {
    try {
      const user = await this.usersService.create(createPsychologistDto.user);
      createPsychologistDto.person.user = user.id.id;
      const person = await this.personsService.create(createPsychologistDto.person);
      const crp = new Crp(createPsychologistDto.crp);
      const psychologist = new Psychologist({
        crp,
        identifyLink: createPsychologistDto.identifyLink,
        degreeLink: createPsychologistDto.degreeLink,
      });
      psychologist.user = user;
      const savedPsychologist =
        await this.psychologistsRepository.save(psychologist);

      return savedPsychologist;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  findAll() {
    return `This action returns all psychologists`;
  }

  async findOne(id: string) {
    try {
      const psychologist = await this.psychologistsRepository
        .createQueryBuilder('psychologist')
        .leftJoinAndSelect("psychologist.user", "user")
        .where('psychologist.id = :id', { id })
        .getOneOrFail();
      psychologist.user.person = await this.personsService.findOneByUserId(psychologist.user.id.id);
      return psychologist;
    }
    catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  update(id: number, updatePsychologistDto: UpdatePsychologistDto) {
    return `This action updates a #${id} psychologist`;
  }

  remove(id: number) {
    return `This action removes a #${id} psychologist`;
  }
}
