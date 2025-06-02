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
    create: jest.fn(
      (
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
        degreeFile: 'degreeFileLink.pdf',
      })
    ),
    findAll: jest.fn(() => [
      {
        id: '1',
        identifyLink: '123',
        meetValue: 150,
        meetDuration: 50,
        crp: {
          crp: 'crp',
          crpLink: 'crpLink.com',
        },
        degreeLink: 'degreeLink.com',
      },
    ]),
    findOne: jest.fn((id: string) => ({
      id,
      identifyLink: '123',
      meetValue: 150,
      meetDuration: 50,
      crp: {
        crp: 'crp',
        crpLink: 'crpLink.com',
      },
      degreeLink: 'degreeLink.com',
    })),

    update: jest.fn((id: string, dto: UpdatePsychologistDto) => ({
      id,
      ...dto,
    })),
    remove: jest.fn((id: string) => ({ id })),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PsychologistsController],
      providers: [
        { provide: PsychologistsService, useValue: mockPsychologistService },
      ],
    }).compile();

    controller = module.get<PsychologistsController>(PsychologistsController);
    service = module.get<PsychologistsService>(PsychologistsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  
  describe('findAll', () => {
    it('Should list all Psychologists', async () => {
      expect(await controller.findAll()).toEqual([
        {
          id: '1',
          identifyLink: '123',
          meetValue: 150,
          meetDuration: 50,
          crp: {
            crp: 'crp',
            crpLink: 'crpLink.com',
          },
          degreeLink: 'degreeLink.com',
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
        identifyLink: '123',
        meetValue: 150,
        meetDuration: 50,
        crp: {
          crp: 'crp',
          crpLink: 'crpLink.com',
        },
        degreeLink: 'degreeLink.com',
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
    });
  });
  describe('remove', () => {
    it('Should remove a Psychologist', async () => {
      const id = '1';
      expect(await controller.remove(id)).toEqual({ id });
      expect(service.remove).toHaveBeenCalled();
    });
  });
});
