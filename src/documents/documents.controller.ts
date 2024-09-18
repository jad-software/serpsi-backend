import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  private async validateDocumentData(createDocumentDto: CreateDocumentDto) {
    const errors = await validate(createDocumentDto);
    if (errors.length > 0) {
      throw new BadRequestException(
        `Validation Error in Field: ${errors[0].property}`
      );
    }
  }

  private validateUploadedFile(document: Express.Multer.File) {
    if (!document) {
      throw new BadRequestException('Document is required');
    }
    if (extname(document.originalname) !== '.md') {
      throw new BadRequestException('Only .md files are allowed!');
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('document'))
  async create(
    @Body() { title, patient }: { title: string; patient: string },
    @UploadedFile()
    document: Express.Multer.File
  ) {
    const createDocumentDto = plainToClass(CreateDocumentDto, {
      title,
      patient,
    });
    await this.validateDocumentData(createDocumentDto);
    this.validateUploadedFile(document);

    return await this.documentsService.create(title, patient, document);
  }

  @Get('/patients/:id')
  async findAllByPatient(@Param('id') id: string) {
    return await this.documentsService.findAllByPatient(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.documentsService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('document'))
  async update(
    @Param('id') id: string,
    @UploadedFile()
    document?: Express.Multer.File,
    @Body('title') updateDocumentDto?: string
  ) {
    return await this.documentsService.update(id, updateDocumentDto, document);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.documentsService.remove(id);
  }
}
