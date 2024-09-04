import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/createPerson.dto';
import { Person } from './entities/person.enitiy';

@Injectable()
export class PersonsService {
  create(createPeronDto: CreatePersonDto) {
    const person = new Person(createPeronDto);
    return person;
  }
}
