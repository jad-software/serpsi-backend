import { Test, TestingModule } from '@nestjs/testing';
import { PsychologistsController } from './psychologists.controller';
import { PsychologistsService } from './psychologists.service';
import { CreatePsychologistDto } from './dto/create-psychologist.dto';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';
import { Phone } from '../persons/vo/phone.vo';
import { Cpf } from '../persons/vo/cpf.vo';
import { BadRequestException } from '@nestjs/common';

describe('PsychologistsController', () => {
  let controller: PsychologistsController;
  let service: PsychologistsService;
  const mockPsychologistService = {
    create: jest.fn((
      dto: CreatePsychologistDto,
      profilePicture: Express.Multer.File,
      crpfile: Express.Multer.File,
      identifyfile: Express.Multer.File,
      degreeFile: Express.Multer.File
    ) => ({
      id: '1',
      ...dto,
      profilePicture: 'profilePictureLink.png',
      crpfile: 'crpfileLink.pdf',
      identifyfile: 'identifyfileLink.pdf',
      degreeFile: 'degreeFileLink.pdf'
    })),
    findAll: jest.fn(() => [
      {
        id: '1', identifyLink: '123', meetValue: 150, meetDuration: 50, crp: {
          crp: 'crp',
          crpLink: 'crpLink.com'
        },
        degreeLink: 'degreeLink.com'
      },
    ]),
    findOne: jest.fn((id: string) => ({
      id,
      identifyLink: '123', meetValue: 150, meetDuration: 50, crp: {
        crp: 'crp',
        crpLink: 'crpLink.com'
      },
      degreeLink: 'degreeLink.com'
    })),

    update: jest.fn((id: string, dto: UpdatePsychologistDto) => ({ id, ...dto })),
    remove: jest.fn((id: string) => ({ id })),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PsychologistsController],
      providers: [{ provide: PsychologistsService, useValue: mockPsychologistService }],
    }).compile();

    controller = module.get<PsychologistsController>(PsychologistsController);
    service = module.get<PsychologistsService>(PsychologistsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('ValidateFileType', () => {
    it('Should throw an error if profilePicture is not an image format', () => {
      const profilePicture = {
        originalname: 'profile.pdf',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      expect(() => controller.validateUploadedFile(profilePicture, ['jpg', 'jpeg', 'png']))
        .toThrow(BadRequestException);
    });

    it('Should throw an error if Files is not a pdf File', () => {
      const crpFile = {
        originalname: 'crpFile.png',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      expect(() => controller.validateUploadedFile(crpFile, ['pdf']))
        .toThrow(BadRequestException);
    });

    it('Should throw an error if Files is missing', () => {
      const crpFile = undefined
      expect(() => controller.validateUploadedFile(crpFile, ['pdf']))
        .toThrow(BadRequestException);
    });

    it('Should pass Validation With Correct File extention', () => {
      const crpFile = {
        originalname: 'crpFile.pdf',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      expect(() => controller.validateUploadedFile(crpFile, ['pdf']))
        .not.toThrow();
    })

  });

  describe('create', () => {
    it('should create a psychologist with the provided files and data', async () => {
      const files = [
        { fieldname: 'profilePicture', originalname: 'profile.jpg' },
        { fieldname: 'crpFile', originalname: 'crp.pdf' },
        { fieldname: 'identifyfile', originalname: 'id.pdf' },
        { fieldname: 'degreeFile', originalname: 'degree.pdf' },
      ] as Express.Multer.File[];

      const cpf = {
        cpf: '123.456.789-00',
      } as Cpf;

      const psychologistData = {
        person: {
          rg: '98.747.153-7',
          birthdate: new Date('2000-01-01'),
          name: 'name de teste',
          cpf,
          phone: new Phone({ ddi: '+1', ddd: '123', number: '4567890' }),
          address: {
            zipCode: '44444-44',
            state: 'BA',
            street: 'Rua de Address teste',
            city: 'cidade',
            district: 'District de Address teste',
            homeNumber: 10,
            complement: 'Complement de Address teste',
          },
        }
        ,
        user: { email: 'john@example.com', password: 'Password@123', role: 'PSI' },
        crp: { crp: '00/123456' },
        meetValue: 100,
        meetDuration: 60,
      };

      const psychologistDataString = JSON.stringify(psychologistData);

      await controller.create(files, psychologistDataString);

      expect(service.create).toHaveBeenCalledWith(
        expect.any(CreatePsychologistDto),
        files[0], // profilePicture
        files[1], // crpFile
        files[2], // identifyfile
        files[3], // degreeFile
      );
    });
  });
  describe('findAll', () => {
    it('Should list all Psychologists', async () => {
      expect(await controller.findAll()).toEqual([
        {
          id: '1', identifyLink: '123', meetValue: 150, meetDuration: 50, crp: {
            crp: 'crp',
            crpLink: 'crpLink.com'
          },
          degreeLink: 'degreeLink.com'
        },

      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
  describe('findOne', () => {
    it('Should return one Psychologist by id', async () => {
      const id = '1';
      expect(await controller.findOne(id)).toEqual({
        id,
        identifyLink: '123', meetValue: 150, meetDuration: 50, crp: {
          crp: 'crp',
          crpLink: 'crpLink.com'
        },
        degreeLink: 'degreeLink.com'
      });
      expect(service.findOne).toHaveBeenCalled();
    });
  });
  describe('update', () => {
    it('Should update a Psychologist', async () => {
      const id = '1';
      const dto: UpdatePsychologistDto = {
        meetDuration: 100,
        meetValue: 50,
      };
      expect(await controller.update(id, dto)).toEqual({ id, ...dto });
      expect(service.update).toHaveBeenCalled();

    })
  });
  describe('remove', () => {
    it('Should remove a Psychologist', async () => {
      const id = '1';
      expect(await controller.remove(id)).toEqual({ id });
      expect(service.remove).toHaveBeenCalled();
    })
  })
});
