import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/createPerson.dto';
import { Person } from './entities/person.enitiy';
import { data_providers } from 'src/constants';
import { Repository } from 'typeorm';
import { Phone } from './vo/phone.vo';
import { Cpf } from './vo/cpf.vo';

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
}
