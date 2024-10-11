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
import { BadRequestException } from '@nestjs/common';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';
import { Phone } from '../persons/vo/phone.vo';

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

  const mockQueryRunner = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    connect: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(), // Mock do método save
    },
  };
  
  const mockRepository = {
    manager: {
      connection: {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner), // Retorna o mock do queryRunner
      },
    },
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    update: jest.fn(),
    remove: jest.fn(),
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
        cpf: '123.456.789-00',
      } as Cpf;
      const crp = {
        crp: '00/123456',
        crpLink: 'crpLink.com',
      } as Crp;
  
      const createPsychologistDto: CreatePsychologistDto = {
        crp,
        meetDuration: 60,
        meetValue: 100,
        user: { email: 'john@example.com', password: 'Password@123', role: Role.PSYCHOLOGIST },
        person: {
          rg: '98.747.153-7',
          birthdate: new Date('1990-01-01'),
          name: 'John Doe',
          phone: { ddi: '+55', ddd: '71', number: '998765432' } as Phone,
          cpf,
          address: {
            zipCode: '41750-001',
            street: 'Rua Teste',
            district: 'Bairro Teste',
            city: 'Salvador',
            state: 'BA',
            homeNumber: 123,
            complement: 'Apt 101',
          },
        },
      };
  
      const mockPsychologist = new Psychologist({});
      mockUsersService.create.mockResolvedValue({ id: { id: 'user-id' } });
      mockPersonsService.create.mockResolvedValue({ id: { id: 'person-id' } });
      mockCloudinaryService.uploadFile.mockResolvedValue({ url: 'file-url' });
      mockQueryRunner.manager.save.mockResolvedValue(mockPsychologist); // Mock do save
  
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
      );
  
      expect(result).toEqual(mockPsychologist);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(expect.any(Psychologist)); // Verifica o save
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled(); // Verifica commit
      expect(mockQueryRunner.release).toHaveBeenCalled(); // Verifica release
    });
  });
  
  describe('findAll', () => {
    it('Should return an array of psychologists with user and person details', async () => {
      const mockPsychologists = [
        {
          id: '1',
          user: { id: { id: 'user-id' }, person: {} },
        },
      ];
  
      mockQueryBuilder.getMany.mockResolvedValue(mockPsychologists);
      mockPersonsService.findOneByUserId.mockResolvedValue({ id: 'person-id' });
  
      const result = await service.findAll();
  
      expect(result).toEqual(mockPsychologists);
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('psychologist.user', 'user');
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(mockPersonsService.findOneByUserId).toHaveBeenCalledWith('user-id');
    });
  });

  describe('findOne', () => {
    it('Should return a psychologist by id with user and person details', async () => {
      const mockPsychologist = {
        id: '1',
        user: { id: { id: 'user-id' }, person: {} },
        meetValue: '100',
      };
  
      mockQueryBuilder.getOneOrFail.mockResolvedValue(mockPsychologist);
      mockPersonsService.findOneByUserId.mockResolvedValue({ id: 'person-id' });
  
      const result = await service.findOne('1');
  
      expect(result).toEqual({
        ...mockPsychologist,
        meetValue: 100,
      });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('psychologist.id = :id', { id: '1' });
      expect(mockQueryBuilder.getOneOrFail).toHaveBeenCalled();
      expect(mockPersonsService.findOneByUserId).toHaveBeenCalledWith('user-id');
    });
  
    it('Should throw BadRequestException if psychologist not found', async () => {
      mockQueryBuilder.getOneOrFail.mockRejectedValue(new Error('Not found'));
  
      await expect(service.findOne('1')).rejects.toThrow(BadRequestException);
    });
  });

  

  describe('remove', () => {
    it('Should remove a psychologist and related files', async () => {
      const mockPsychologist = {
        id: '1',
        user: {
          id: { id: 'user-id' }, 
          person: { id: { id: 'person-id' } }, 
        },
        crp: { crpLink: 'crpLink/file-id' },
        identifyLink: 'identifyLink/file-id', 
        degreeLink: 'degreeLink/file-id', 
      };
  
      service.findOne = jest.fn().mockResolvedValue(mockPsychologist);  
  

      await service.remove('1');
  

      expect(mockRepository.remove).toHaveBeenCalledWith(mockPsychologist);
  

      expect(mockPersonsService.delete).toHaveBeenCalledWith('person-id');
  

      expect(mockUsersService.remove).toHaveBeenCalledWith('user-id');
  

      expect(mockCloudinaryService.deleteFileOtherThanImage).toHaveBeenCalledTimes(3);
      expect(mockCloudinaryService.deleteFileOtherThanImage).toHaveBeenCalledWith('file-id');
    });
  });
  
  describe('update', () => {
    it('Should update a psychologist without changing the service', async () => {
      const mockPsychologist = {
        id: '1',
        user: {
          id: { id: 'user-id' },
          person: { id: { id: 'person-id' } },
        },
        crp: { crp: '00/123456' },
      };
  
      service.findOne = jest.fn().mockResolvedValue(mockPsychologist);
  
      mockPersonsService.findOneByUserId.mockResolvedValue({
        id: { id: 'person-id' },
      });
  
      const updateDto: UpdatePsychologistDto = {
        person: { name: 'Updated Name' },
        user: { email: 'updated@example.com' },
        crp: { crp: '00/654321' } as Crp,
      };
  
      mockPersonsService.update.mockResolvedValue({});
      mockUsersService.update.mockResolvedValue({});
      mockRepository.update.mockResolvedValue(mockPsychologist);
  
      const result = await service.update('1', updateDto);
      expect(mockPersonsService.update).toHaveBeenCalledWith('person-id', updateDto.person);
      expect(mockUsersService.update).toHaveBeenCalledWith('user-id', updateDto.user);
      expect(mockRepository.update).toHaveBeenCalledWith('1', mockPsychologist);
      expect(result).toEqual(mockPsychologist);
    });
  });
  
  
});
