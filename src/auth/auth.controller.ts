import { BadRequestException, Body, Controller, Get, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guards';
import { JwtAuthGuard } from './guards/jwt.guards';
import { Public } from '../constants';
import { User } from './providers/user.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/login.dto';
import { RolesGuard } from './guards/roles.guards';
import { Roles } from './providers/roles.decorator';
import { Role } from '../users/vo/role.enum';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { CreatePsychologistDto } from '../psychologists/dto/create-psychologist.dto';
import { validate } from 'class-validator';
import { extname } from 'path';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDTO })
  @ApiOperation({ summary: 'Faz login com email e senha' })
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'teste como funciona o JWT vai' })
  @Roles(Role.PSYCHOLOGIST)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user) {
    return user;
  }

  @Public()
  @UseGuards(JwtAuthGuard)
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
                      type: 'string',
                      example: '291c',
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
  @Post('register/psychologist')
  @UseInterceptors(AnyFilesInterceptor())
  async registerPsychologist(
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

    return await this.authService.register(
      createPsychologistDto,
      profilePicture,
      crpfile,
      identifyfile,
      degreeFile
    );
  }

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
}
