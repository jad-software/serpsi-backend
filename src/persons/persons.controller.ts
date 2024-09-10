import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAddressDto } from '../addresses/dto/createAddress.dto';
import { CreatePersonDto } from './dto/createPerson.dto';
import { UpdateAddressDto } from '../addresses/dto/updateAddress.dto';
import { UpdatePersonDto } from './dto/updatePerson.dto';
import { Person } from './entities/person.enitiy';
import { PersonsService } from './persons.service';
import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('persons')
@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria Person',
  })
  @ApiResponse({
    status: 201,
  })
  async create(@Body() createPeronDto: CreatePersonDto): Promise<Person> {
    return this.personsService.create(createPeronDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retorna todas as Persons',
  })
  @ApiResponse({
    status: 200,
  })
  async findAll(): Promise<Person[]> {
    return await this.personsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Retorna uma Person de acordo com o id e faz o relacionamento com Address e User',
  })
  async findOneById(@Param('id') id: string): Promise<Person> {
    return await this.personsService.findOneById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Faz o updade de uma Person de acordo com o id',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto
  ) {
    return await this.personsService.update(id, updatePersonDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Faz o delete de uma Person de acordo com o id',
  })
  async delete(@Param('id') id: string): Promise<any> {
    return await this.personsService.delete(id);
  }

  @Put('/picture/:id')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async uploadPictore(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpeg|png)$/ })],
      })
    )
    file: Express.Multer.File,
    @Param('id') id: string
  ) {
    return await this.personsService.savePersonPicture(file, id);
  }
}
