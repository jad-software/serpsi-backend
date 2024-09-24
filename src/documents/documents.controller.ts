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
  UploadedFiles,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('documents')
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

  private validateUploadedFile(
    document: Express.Multer.File,
    typeOfExtention: string
  ) {
    if (!document) {
      throw new BadRequestException('Document is required');
    }
    if (extname(document.originalname) !== `.${typeOfExtention}`) {
      throw new BadRequestException(
        `Only .${typeOfExtention} files are allowed!`
      );
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Cria um documento com título, vinculo com paciente e arquivo',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'título de documento de sessão',
        },
        patient: {
          type: 'string',
          example: '220fb404-4bf2-47c8-a20f-210f6e811620',
        },
        document: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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
    this.validateUploadedFile(document, 'md');

    return await this.documentsService.create(title, patient, document);
  }

  @Post('/followups')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        patient: {
          type: 'string',
          example: 'f35f827e-0899-4d63-976a-2b9aac7fb3ff',
        },
        document: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('documents'))
  async createFollowups(
    @Body() { patient }: { patient: string },
    @UploadedFiles()
    documents: Express.Multer.File[]
  ) {
    if (patient === undefined) {
      throw new BadRequestException(`Patient is required`);
    }
    documents.map((doc) => {
      this.validateUploadedFile(doc, 'pdf');
    });
    return await this.documentsService.createFollowUps(patient, documents);
  }

  @Get('/patients/:id')
  @ApiOperation({
    summary:
      'Retorna todos os documentos de um paciente de acordo com o id do prórpio paciente',
  })
  async findAllByPatient(@Param('id') id: string) {
    return await this.documentsService.findAllByPatient(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retorna um documento de acordo com o id',
  })
  async findOne(@Param('id') id: string) {
    return await this.documentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza um documento',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'atualização de título de documento de sessão',
        },
        document: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Deleta um documento de acordo com o id no banco e no cloudinary',
  })
  async remove(@Param('id') id: string) {
    return await this.documentsService.remove(id);
  }
}
