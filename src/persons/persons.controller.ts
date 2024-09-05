import { CreatePersonDto } from './dto/createPerson.dto';
import { UpdatePersonDto } from './dto/updatePerson.dto';
import { Person } from './entities/person.enitiy';
import { PersonsService } from './persons.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) { }

  @Post()
  async create(@Body() createPeronDto: CreatePersonDto): Promise<Person> {
    return this.personsService.create(createPeronDto);
  }

  @Get()
  async findAll(): Promise<Person[]> {
    return await this.personsService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<Person> {
    return await this.personsService.findOneById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return await this.personsService.update(id, updatePersonDto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return await this.personsService.delete(id);
  }
}
