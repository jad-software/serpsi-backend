import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdateSchoolDto } from './dto/school/update-school.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateComorbidityDto } from './dto/comorbities/create-comorbidity.dto';
import { CreateMedicamentInfoDto } from './dto/medicine/create-medicament-info.dto';
import {
  AnyFilesInterceptor,
} from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { extname } from 'path';
import { User } from '../auth/providers/user.decorator';

@ApiTags('patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

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

  @ApiOperation({ summary: 'Criação de um novo paciente' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        patientData: {
          type: 'object',
          properties: {
            paymentPlan: {
              type: 'string',
              example: 'TRIMESTRAL',
            },
            psychologistId: {
              type: 'string',
              example: '1a6aecba-45d0-44c5-a47d-55b5aaeba93a',
            },
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
                      type: 'string',
                      example: '278',
                    },
                    complement: {
                      type: 'string',
                      example: 'complemento de refatoração no update',
                    },
                  },
                },
              },
            },
            parents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Meu nome Pai File',
                  },
                  rg: {
                    type: 'string',
                    example: '12.884.728-1',
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
                        example: '423.913.129-09',
                      },
                    },
                  },
                },
              },
            },
            school: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'ativa idade',
                },
                CNPJ: {
                  type: 'string',
                  example: '00.000.000/0001-00',
                },
                address: {
                  type: 'object',
                  properties: {
                    state: {
                      type: 'string',
                      example: 'BA',
                    },
                    zipCode: {
                      type: 'string',
                      example: '4499815760',
                    },
                    street: {
                      type: 'string',
                      example: 'rua dos bobos',
                    },
                    district: {
                      type: 'string',
                      example: 'bairro bonito',
                    },
                    city: {
                      type: 'string',
                      example: 'cidade que ficou faltando',
                    },
                    homeNumber: {
                      type: 'string',
                      example: '1131',
                    },
                    complement: {
                      type: 'string',
                      example: 'complemento',
                    },
                  },
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
              },
            },
            comorbidities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'autismo grau 1',
                  },
                },
              },
            },
            medicines: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  medicine: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        example: 'Buscopan',
                      },
                    },
                  },
                  dosage: {
                    type: 'number',
                    example: 250,
                  },
                  dosageUnity: {
                    type: 'string',
                    example: 'mg',
                  },
                  frequency: {
                    type: 'number',
                    example: 2,
                  },
                  firstTimeOfTheDay: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-01-01T08:00:00.000Z',
                  },
                  startDate: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-07-20T00:00:00.000Z',
                  },
                  observation: {
                    type: 'string',
                    example: 'Tomar antes de comer',
                  },
                },
              },
            },
          },
        },
        profilePicture: {
          type: 'string',
          format: 'binary',
        },
        documents: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('patientData') patientData: string
  ) {
    const parsedData = JSON.parse(patientData);
    const createPatientDto = plainToClass(CreatePatientDto, parsedData);

    const errors = await validate(createPatientDto);
    if (errors.length > 0) {
      throw new BadRequestException(`Validation Error in Field: ${errors[0]}`);
    }
    const documents = files.filter((file) => file.fieldname === 'documents');
    documents.map((doc) => {
      this.validateUploadedFile(doc, ['pdf'], false);
    });
    const profilePicture = files.filter(
      (file) => file.fieldname === 'profilePicture'
    )[0];
    this.validateUploadedFile(profilePicture, ['jpg', 'jpeg', 'png']);
    return await this.patientsService.create(
      createPatientDto,
      profilePicture,
      documents
    );
  }

  @ApiOperation({ summary: 'lista todos os pacientes' })
  @Get()
  async findAll() {
    return await this.patientsService.findAll();
  }

  @ApiOperation({ summary: 'lista todos os pacientes de um psicólogo' })
  @Get('/psychologist')
  async findAllByPsychologist(@User() userInfo) {
    return await this.patientsService.findAllByPsychologist(userInfo.id);
  }
  
  @ApiOperation({ summary: 'lista todos os pacientes de um psicólogo com o contador de sessões restantes' })
  @Get('/addmeeting')
  async findAllToAddMeeting(@User() userInfo) {
    return await this.patientsService.findAllByPsychologistToANewMeeting(userInfo.id);
  }
  
  @ApiOperation({ summary: 'retorna um paciente pelo id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.patientsService.findOne(id);
  }
  
  @ApiOperation({ summary: 'retorna o histórico de sessões pelo id de um paciente' })
  @Get('/meetings/:patient_id')
  async findAllMeetings(@Param('patient_id') id: string) {
    return await this.patientsService.findAllMeetings(id);
  }

  @ApiOperation({ summary: 'atualiza um paciente pelo id' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto
  ) {
    return await this.patientsService.update(id, updatePatientDto);
  }

  @ApiOperation({ summary: 'atualiza a escola de um paciente pelo id' })
  @Put(':id/school')
  async updateSchool(@Param('id') id: string, @Body() school: UpdateSchoolDto) {
    return await this.patientsService.updateSchool(id, school);
  }

  @ApiOperation({
    summary: 'atualiza a lista de comorbidades de um paciente pelo id',
  })
  @ApiBody({
    type: CreateComorbidityDto,
    isArray: true,
  })
  @Put(':id/comorbities')
  async addComorbities(
    @Param('id') id: string,
    @Body() comorbities: CreateComorbidityDto[]
  ) {
    return await this.patientsService.addComorbities(id, comorbities);
  }

  @ApiOperation({
    summary:
      'adiciona medicamentos para lista de um paciente pelo id (se a conexão com o remedio já existir ele atualiza)',
  })
  @ApiBody({
    type: CreateMedicamentInfoDto,
    isArray: true,
  })
  @Put(':id/medicament')
  async addMedicaments(
    @Param('id') id: string,
    @Body() medicaments: CreateMedicamentInfoDto[]
  ) {
    return await this.patientsService.addMedicaments(id, medicaments);
  }

  @ApiOperation({ summary: 'deleta um paciente pelo id' })
  @Delete(':id/medicament/:medId')
  async removeMedicaments(
    @Param('id') id: string,
    @Param('medId') medId: string
  ) {
    return await this.patientsService.removeMedicament(id, medId);
  }

  @ApiOperation({ summary: 'deleta um paciente pelo id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.patientsService.remove(id);
  }
}
