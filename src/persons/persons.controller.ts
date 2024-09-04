import { CreatePersonDto } from './dto/createPerson.dto';
import { Person } from './entities/person.enitiy';
import { PersonsService } from './persons.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  public create(@Body() createPeronDto: CreatePersonDto): Person {
    return this.personsService.create(createPeronDto);
  }
}
