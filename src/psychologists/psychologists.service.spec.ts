import { CreatePsychologistDto } from './dto/create-psychologist.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { PsychologistsService } from './psychologists.service';
import { Repository } from 'typeorm';
import { Psychologist } from './entities/psychologist.entity';
import { UsersService } from '../users/users.service';
import { PersonsService } from '../persons/persons.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Cpf } from '../persons/vo/cpf.vo';
import { Crp } from './vo/crp.vo';
import { User } from '../users/entities/user.entity';
import { Person } from '../persons/entities/person.enitiy';
import { Role } from '../users/vo/role.enum';
import { data_providers } from '../constants';
import { release } from 'os';

describe('PsychologistsService', () => {
  let service: PsychologistsService;
  let userService: UsersService;
  let personService: PersonsService;
  let cloudinaryService: CloudinaryService;
  let mockQueryBuilder: Partial<{
    where: jest.Mock;
    select: jest.Mock;
    getOneOrFail: jest.Mock;
    getMany: jest.Mock;
    leftJoinAndSelect: jest.Mock;
  }> = {
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getOneOrFail: jest.fn(),
    getMany: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
  };

  const mockRepository = {
    manager: {
      connection: {
        createQueryRunner: jest.fn().mockReturnValue({
          startTransaction: jest.fn(),
          commitTransaction: jest.fn(),
          rollbackTransaction: jest.fn(),
          connect: jest.fn(),
          release: jest.fn(),
          manager: {
            save: jest.fn(), // Adicionando o mock de save
          },
        }),
      },
    },
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockPersonsService = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOneByUserId: jest.fn()
  };

  const mockUsersService = {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockCloudinaryService = {
    uploadFile: jest.fn(),
    deleteFileOtherThanImage: jest.fn(),
  };

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PsychologistsService,
        {
          provide: data_providers.PSYCHOLOGISTS_REPOSITORY,
          useValue: mockRepository
        },
        {
          provide: UsersService,
          useValue: mockUsersService
        },
        {
          provide: PersonsService,
          useValue: mockPersonsService
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService
        },
      ],
    }).compile();

    service = module.get<PsychologistsService>(PsychologistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Should create and save a new Psychologist', async () => {
      const cpf = {
        cpf: '',
      } as Cpf;
      const crp = {
        crp: '',
        crpLink: ''
      } as Crp;

      const createPsychologistDto: CreatePsychologistDto = {
        crp,
        meetDuration: 0,
        meetValue: 0,
        user: {
          email: '',
          password: '',
          role: Role.PSYCHOLOGIST
        },
        person: {
          rg: '',
          birthdate: undefined,
          name: '',
          phone: undefined,
          cpf,
          address: {
            zipCode: '',
            street: '',
            district: '',
            city: '',
            state: '',
            homeNumber: 0,
            complement: '',
          },
        },
      }

      const mockPsychologist = new Psychologist({});
      mockUsersService.create.mockResolvedValue({ id: { id: 'user-id' } });
      mockPersonsService.create.mockResolvedValue({ id: { id: 'person-id' } });
      mockCloudinaryService.uploadFile.mockResolvedValue({ url: 'file-url' });
      mockRepository.save.mockResolvedValue(mockPsychologist);
      mockRepository.manager
      .connection.createQueryRunner()
      .manager.save.mockResolvedValue(mockPsychologist);


      const files = [
        { fieldname: 'profilePicture', originalname: 'profile.jpg' },
        { fieldname: 'crpFile', originalname: 'crp.pdf' },
        { fieldname: 'identifyfile', originalname: 'id.pdf' },
        { fieldname: 'degreeFile', originalname: 'degree.pdf' },
      ] as Express.Multer.File[];

      const result = await service.create(
        createPsychologistDto,
        files[0], // profilePicture
        files[1], // crpFile
        files[2], // identifyfile
        files[3], // degreeFile
      )
      expect(result).toEqual(mockPsychologist);
      expect(mockRepository.manager
        .connection.createQueryRunner()
        .manager.save).toHaveBeenCalledWith(expect.any(Psychologist));
    });
  
  })
});
