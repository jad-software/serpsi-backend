import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PsychologistsService } from './psychologists.service';
import { CreatePsychologistDto } from './dto/create-psychologist.dto';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';

@Controller('psychologists')
export class PsychologistsController {
  constructor(private readonly psychologistsService: PsychologistsService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('psychologistData') psychologistData: string
  ) {
    const parsedData = JSON.parse(psychologistData);
    const createPsychologistDto = plainToClass(CreatePsychologistDto, parsedData);
    const profilePicture = files.filter((file) => file.fieldname === 'profilePicture')[0];
    const crpfile = files.filter((file) => file.fieldname === 'crpFile')[0];
    const identifyfile = files.filter((file) => file.fieldname === 'identifyfile')[0];
    const degreeFile = files.filter((file) => file.fieldname === 'degreeFile')[0];

    console.log(createPsychologistDto);
    return this.psychologistsService.create(
      createPsychologistDto,
      profilePicture,
      crpfile,
      identifyfile,
      degreeFile
    );
  }

  @Get()
  findAll() {
    return this.psychologistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.psychologistsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePsychologistDto: UpdatePsychologistDto
  ) {
    return this.psychologistsService.update(id, updatePsychologistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.psychologistsService.remove(id);
  }
}
