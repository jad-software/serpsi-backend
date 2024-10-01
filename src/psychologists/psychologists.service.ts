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
  ) {}

  async create(createPsychologistDto: CreatePsychologistDto) {
    try {
      const user = await this.usersService.create(createPsychologistDto.user);
      createPsychologistDto.person.user = user.id.id;
      const person = await this.personsService.create(
        createPsychologistDto.person
      );
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

  async findAll() {
    try {
      const psychologists = await this.psychologistsRepository
        .createQueryBuilder('psychologist')
        .leftJoinAndSelect('psychologist.user', 'user')
        .getMany();
      for (let psy of psychologists) {
        if (psy.user) {
          psy.user.person = await this.personsService.findOneByUserId(
            psy.user.id.id
          );
        }
      }
      return psychologists;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async findOne(id: string) {
    try {
      const psychologist = await this.psychologistsRepository
        .createQueryBuilder('psychologist')
        .leftJoinAndSelect('psychologist.user', 'user')
        .where('psychologist.id = :id', { id })
        .getOneOrFail();
      psychologist.user.person = await this.personsService.findOneByUserId(
        psychologist.user.id.id
      );
      return psychologist;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async update(id: string, updatePsychologistDto: UpdatePsychologistDto) {
    try {
      let foundPsychologist = await this.findOne(id);
      const updateTasks = [];
      if (updatePsychologistDto.person) {
        updateTasks.push(
          this.personsService.update(
            foundPsychologist.user.person.id.id,
            updatePsychologistDto.person
          )
        );
        delete updatePsychologistDto.person;
      }
      if (updatePsychologistDto.user) {
        updateTasks.push(
          this.usersService.update(
            foundPsychologist.user.id.id,
            updatePsychologistDto.user
          )
        );
        delete updatePsychologistDto.user;
      }
      if (updatePsychologistDto.crp) {
        foundPsychologist.crp = new Crp(
          updatePsychologistDto.crp || foundPsychologist.crp
        );
        delete updatePsychologistDto.crp;
      }
      Object.assign(foundPsychologist, updatePsychologistDto);
      await Promise.all([
        this.psychologistsRepository.update(id, foundPsychologist),
        ...updateTasks,
      ]);
      foundPsychologist = await this.findOne(id);
      return foundPsychologist;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async remove(id: string) {
    try {
      const foundPsychologist = await this.findOne(id);
      await this.psychologistsRepository.remove(foundPsychologist);
      await this.personsService.delete(foundPsychologist.user.person.id.id);
      await this.usersService.remove(foundPsychologist.user.id.id);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
}
