import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/createPerson.dto';
import { Person } from './entities/person.enitiy';
import { data_providers } from 'src/constants';
import { Repository } from 'typeorm';
import { Phone } from './vo/phone.vo';
import { Cpf } from './vo/cpf.vo';
import { Id } from 'src/entity-base/vo/id.vo';
import { UpdatePersonDto } from './dto/updatePerson.dto';

@Injectable()
export class PersonsService {
  constructor(
    @Inject(data_providers.PERSON_REPOSITORY)
    private personRepository: Repository<Person>
  ) {}
  async create(createPersonDto: CreatePersonDto) {
    try {
      const phone = new Phone(
        createPersonDto.phone.ddd,
        createPersonDto.phone.ddi,
        createPersonDto.phone.number
      );
      const cpf = new Cpf(createPersonDto.cpf.cpf);
      const person = new Person({
        birthdate: createPersonDto.birthdate,
        phone: phone,
        profilePicture: createPersonDto.profilePicture,
        rg: createPersonDto.rg,
        cpf: cpf,
        name: createPersonDto.name,
      });

      await this.personRepository.save(person);
      return person;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
  async findAll(): Promise<Person[]> {
    try {
      return await this.personRepository.find();
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
  async findOneById(id: string): Promise<Person> {
    try {
      const person = await this.personRepository
        .createQueryBuilder('person')
        .where('person._id = :id', { id })
        .getOneOrFail();
      return person;
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    try {
      const person = new Person(updatePersonDto);
      let foundPerson = await this.findOneById(id);
      if (updatePersonDto.phone) {
        person.phone = new Phone(
          updatePersonDto.phone.ddi || foundPerson.phone.ddi,
          updatePersonDto.phone.ddd || foundPerson.phone.ddd,
          updatePersonDto.phone.number || foundPerson.phone.number
        );
      }
      if (updatePersonDto.cpf) {
        person.cpf = new Cpf(updatePersonDto.cpf.cpf);
      }

      const personUpdated = await this.personRepository.update(
        foundPerson.id.id,
        person
      );
      foundPerson = await this.findOneById(id);
      return foundPerson;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const person = await this.findOneById(id);
      await this.personRepository.delete(person);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
}
