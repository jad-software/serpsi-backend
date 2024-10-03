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
  BadRequestException,
} from '@nestjs/common';
import { PsychologistsService } from './psychologists.service';
import { CreatePsychologistDto } from './dto/create-psychologist.dto';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { extname } from 'path';

@Controller('psychologists')
export class PsychologistsController {
  constructor(private readonly psychologistsService: PsychologistsService) { }

  private validateUploadedFile(
    document: Express.Multer.File,
    allowedFileTypes: string[],
    isRequired = true
  ) {
    if (!document && isRequired) {
      throw new BadRequestException('Profile Picture is required');
    }
    const fileExtension = extname(document.originalname);
    const validExtensions = allowedFileTypes.map((ext) => `.${ext}`);

    if (!validExtensions.includes(fileExtension)) {
      const allowedExts = validExtensions.join(', ');
      throw new BadRequestException(
        `Only the following file types are allowed: ${allowedExts}`
      );
    }
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('psychologistData') psychologistData: string
  ) {
    const parsedData = JSON.parse(psychologistData);
    const createPsychologistDto = plainToClass(CreatePsychologistDto, parsedData);

    const profilePicture = files.filter((file) => file.fieldname === 'profilePicture')[0];
    this.validateUploadedFile(profilePicture, ['jpg', 'jpeg', 'png']);
    files.map((file) => {
      if(file.fieldname !== 'profilePicture'){
        this.validateUploadedFile(file, ['pdf']);
      }
    });

    const crpfile = files.filter((file) => file.fieldname === 'crpFile')[0];
    const identifyfile = files.filter((file) => file.fieldname === 'identifyfile')[0];
    const degreeFile = files.filter((file) => file.fieldname === 'degreeFile')[0];

    const errors = await validate(createPsychologistDto);
    if (errors.length > 0) {
      throw new BadRequestException(
        `Validation Error in Field: ${errors[0]}`
      );
    }
    
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
