import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePsychologistDto } from './dto/create-psychologist.dto';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';
import { data_providers } from '../constants';
import { Repository } from 'typeorm';
import { Psychologist } from './entities/psychologist.entity';
import { UsersService } from '../users/users.service';
import { PersonsService } from '../persons/persons.service';
import { Crp } from './vo/crp.vo';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ChangePassworDto } from './dto/change-password.dto';
import { Day } from './vo/days.enum';
import { formatTime } from '../helpers/format-time';
import { Times } from './interfaces/times.interface';

@Injectable()
export class PsychologistsService {
  constructor(
    @Inject(data_providers.PSYCHOLOGISTS_REPOSITORY)
    private psychologistsRepository: Repository<Psychologist>,
    @Inject()
    private usersService: UsersService,
    @Inject()
    private personsService: PersonsService,
    @Inject()
    private cloudinaryService: CloudinaryService
  ) { }

  async create(
    createPsychologistDto: CreatePsychologistDto,
    profilePicture: Express.Multer.File,
    crpFile?: Express.Multer.File,
    identifyfile?: Express.Multer.File,
    degreeFile?: Express.Multer.File
  ) {
    const queryRunner =
      this.psychologistsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    let ids: Record<string, any> = {};
    let publicsIds = [];
    try {
      await queryRunner.startTransaction();
      const user = await this.usersService.create(
        createPsychologistDto.user,
        true
      );
      ids['user'] = user.id.id;

      createPsychologistDto.person.user = user.id.id;
      const [person, crpSaved, identifySaved, degreeSaved] = await Promise.all([
        this.personsService.create(
          createPsychologistDto.person,
          true,
          profilePicture
        ),
        this.cloudinaryService.uploadFile(crpFile, true),
        this.cloudinaryService.uploadFile(identifyfile, true),
        this.cloudinaryService.uploadFile(degreeFile, true),
      ]);
      ids['person'] = person.id.id;

      publicsIds.push(crpSaved.url.split('/').slice(-1)[0]);
      publicsIds.push(identifySaved.url.split('/').slice(-1)[0]);
      publicsIds.push(degreeSaved.url.split('/').slice(-1)[0]);

      const crp = new Crp({
        crp: createPsychologistDto.crp.crp,
        crpLink: crpSaved.url,
      });

      const psychologist = new Psychologist({
        crp,
        identifyLink: identifySaved.url,
        degreeLink: degreeSaved.url,
        meetValue: +createPsychologistDto.meetValue,
        meetDuration: createPsychologistDto.meetDuration,
      });
      psychologist.user = user;
      const savedPsychologist = await queryRunner.manager.save(psychologist);

      await queryRunner.commitTransaction();
      return savedPsychologist;
    } catch (err) {
      const operations = [
        ids['user'] ? this.usersService.remove(ids['user']) : null,
        ids['person'] ? this.personsService.delete(ids['person']) : null,
        ...publicsIds.map((publicID) =>
          this.cloudinaryService.deleteFileOtherThanImage(publicID)
        ),
      ].filter(Boolean);

      await queryRunner.rollbackTransaction();
      await Promise.allSettled([operations]);
      throw new BadRequestException(err?.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findOneByUser(id: string): Promise<Psychologist> {
    const allPsychologist = await this.findAll();
    const psychologist = allPsychologist.filter((p) => p.user.id.id === id)[0];
    return psychologist;
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

  async findOne(id: string, relations: boolean = true) {
    try {
      const queryBuilder = this.psychologistsRepository
        .createQueryBuilder('psychologist')
        .where('psychologist.id = :id', { id })

      if (relations) {
        queryBuilder
          .leftJoinAndSelect('psychologist.user', 'user')
          .leftJoinAndSelect('user.person', 'person')
      }
      const psychologist = await queryBuilder.getOneOrFail();

      psychologist.meetValue = +psychologist.meetValue;
      return psychologist;
    } catch (err) {
      throw new NotFoundException('Nenhum psicologo encontrado');
    }
  }

  async update(id: string, updatePsychologistDto: UpdatePsychologistDto) {
    try {
      let foundPsychologist = await this.findOne(id);
      const updateTasks = [];
      const { person, user, crp, ...otherFields } = updatePsychologistDto;
      if (person) {
        updateTasks.push(
          this.personsService.update(
            foundPsychologist.user.person.id.id,
            updatePsychologistDto.person
          )
        );
      }
      if (user) {
        updateTasks.push(
          this.usersService.update(
            foundPsychologist.user.id.id,
            updatePsychologistDto.user
          )
        );
        user;
      }
      if (crp) {
        foundPsychologist.crp = new Crp(
          updatePsychologistDto.crp || foundPsychologist.crp
        );
        crp;
      }
      Object.assign(foundPsychologist, otherFields);
      await this.psychologistsRepository.update(id, foundPsychologist);
      await Promise.all([...updateTasks]);
      foundPsychologist = await this.findOne(id);
      return foundPsychologist;
    } catch (err) {
      throw new InternalServerErrorException('problemas ao atualizar o psicologo');
    }
  }

  async remove(id: string) {
    try {
      const foundPsychologist = await this.findOne(id);
      await this.psychologistsRepository.remove(foundPsychologist);
      await this.personsService.delete(foundPsychologist.user.person.id.id);
      await this.usersService.remove(foundPsychologist.user.id.id);
      const crpPublicID = foundPsychologist.crp.crpLink.split('/').slice(-1)[0];
      const identifyPublicId = foundPsychologist.identifyLink
        .split('/')
        .slice(-1)[0];
      const degreePublicId = foundPsychologist.degreeLink
        .split('/')
        .slice(-1)[0];
      await Promise.all([
        this.cloudinaryService.deleteFileOtherThanImage(crpPublicID),
        this.cloudinaryService.deleteFileOtherThanImage(identifyPublicId),
        this.cloudinaryService.deleteFileOtherThanImage(degreePublicId),
      ]);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async updatePassword(id: string, changePasswordDto: ChangePassworDto) {
    try {
      const person = await this.findOne(id);
      const result = await this.usersService.updatePassword(
        person.user.email.email,
        changePasswordDto
      );
      return result;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async getTimes(id: string, dayOfAgenda?: Day): Promise<Times> {
  const psychologist = await this.psychologistsRepository
    .createQueryBuilder('psychologist')
    .where('psychologist.id = :id', { id })
    .leftJoinAndSelect('psychologist.agendas', 'agendas')
    .getOneOrFail();

  let avaliableTimes: { day: Day, times: string[] }[] = [];
  psychologist.agendas.filter((value) => dayOfAgenda === value.day).forEach((agenda) => {
    let times = []
    const start = new Date('2024-12-04T' + agenda.startTime + 'z');
    const end = new Date('2024-12-04T' + agenda.endTime + 'z');
    if (start > end) {
      throw new BadRequestException('Start time must be before end time');
    }
    while (start < end) {
      times.push(formatTime(start));
      start.setMinutes(start.getMinutes() + psychologist.meetDuration);
    };
    avaliableTimes.push({
      day: agenda.day,
      times
    });
  })
    return {
    meetDuration: psychologist.meetDuration,
    avaliableTimes
  };
}


}
