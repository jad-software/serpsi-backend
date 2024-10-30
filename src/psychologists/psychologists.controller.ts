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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ChangePassworDto } from './dto/change-password.dto';

@ApiTags('psychologists')
@ApiBearerAuth()
@Controller('psychologists')
export class PsychologistsController {
  constructor(private readonly psychologistsService: PsychologistsService) {}

  validateUploadedFile(
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
  @ApiOperation({ summary: 'Criação de um novo psicólogo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        psychologistData: {
          type: 'object',
          properties: {
            person: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'Meu nome de agora teste FILE',
                },
                rg: {
                  type: 'string',
                  example: '98.749.153-5',
                },
                birthdate: {
                  type: 'string',
                  format: 'date',
                  example: '1990-08-25',
                },
                phone: {
                  type: 'object',
                  properties: {
                    ddi: {
                      type: 'string',
                      example: '+55',
                    },
                    ddd: {
                      type: 'string',
                      example: '71',
                    },
                    number: {
                      type: 'string',
                      example: '998085317',
                    },
                  },
                },
                cpf: {
                  type: 'object',
                  properties: {
                    cpf: {
                      type: 'string',
                      example: '473.873.929-75',
                    },
                  },
                },
                address: {
                  type: 'object',
                  properties: {
                    state: {
                      type: 'string',
                      example: 'SP',
                    },
                    zipCode: {
                      type: 'string',
                      example: '41796616',
                    },
                    street: {
                      type: 'string',
                      example: 'teste de street de refatoração no update',
                    },
                    district: {
                      type: 'string',
                      example: 'district de teste de refatoração no update',
                    },
                    city: {
                      type: 'string',
                      example: 'São Paulo',
                    },
                    homeNumber: {
                      type: 'number',
                      example: 278,
                    },
                    complement: {
                      type: 'string',
                      example: 'complemento de refatoração no update',
                    },
                  },
                },
              },
            },
            user: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  example: 'Psi123@teste.com',
                },
                password: {
                  type: 'string',
                  example: 'Ifwrifn@123',
                },
                role: {
                  type: 'string',
                  example: 'PSI',
                },
              },
            },
            crp: {
              type: 'object',
              properties: {
                crp: {
                  type: 'string',
                  example: '00/123456',
                },
              },
            },
            meetValue: {
              type: 'IsNumber',
              example: 10,
            },
            meetDuration: {
              type: 'IsNumber',
              example: 200,
            },
          },
        },
        crpFile: {
          type: 'string',
          format: 'binary',
        },
        identifyfile: {
          type: 'string',
          format: 'binary',
        },
        profilePicture: {
          type: 'string',
          format: 'binary',
        },
        degreeFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('psychologistData') psychologistData: string
  ) {
    const parsedData = JSON.parse(psychologistData);
    const createPsychologistDto = plainToClass(
      CreatePsychologistDto,
      parsedData
    );

    const profilePicture = files.filter(
      (file) => file.fieldname === 'profilePicture'
    )[0];
    this.validateUploadedFile(profilePicture, ['jpg', 'jpeg', 'png']);
    files.map((file) => {
      if (file.fieldname !== 'profilePicture') {
        this.validateUploadedFile(file, ['pdf']);
      }
    });

    const crpfile = files.filter((file) => file.fieldname === 'crpFile')[0];
    const identifyfile = files.filter(
      (file) => file.fieldname === 'identifyfile'
    )[0];
    const degreeFile = files.filter(
      (file) => file.fieldname === 'degreeFile'
    )[0];

    const errors = await validate(createPsychologistDto);
    if (errors.length > 0) {
      throw new BadRequestException(`Validation Error in Field: ${errors[0]}`);
    }

    return await this.psychologistsService.create(
      createPsychologistDto,
      profilePicture,
      crpfile,
      identifyfile,
      degreeFile
    );
  }

  @ApiOperation({ summary: 'Lista todos os psicólogos' })
  @Get()
  async findAll() {
    return await this.psychologistsService.findAll();
  }

  @ApiOperation({ summary: 'Lista um psicólogo pelo id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.psychologistsService.findOne(id);
  }

  @ApiOperation({ summary: 'atualiza um psicólogo pelo id' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePsychologistDto: UpdatePsychologistDto
  ) {
    return await this.psychologistsService.update(id, updatePsychologistDto);
  }

  @ApiOperation({ summary: 'deleta um psicólogo pelo id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.psychologistsService.remove(id);
  }

  @Patch('/updatePassword/:id')
  async updatePassword(@Param('id') id: string, @Body() changePassword: ChangePassworDto){
    return await this.psychologistsService.updatePassword(id, changePassword);
  }
}
