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

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('document'))
  async create(
    @Body('title') title: string,
    @Body('personId') personId: string,
    @UploadedFile()
    document: Express.Multer.File
  ) {
    if (extname(document.originalname) !== '.md') {
      throw new BadRequestException('Only .md files are allowed!');
    }
    return await this.documentsService.create(title,personId, document);
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
