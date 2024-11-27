import { Test, TestingModule } from '@nestjs/testing';
import { UnusualService } from './unusual.service';
import { PsychologistsService } from './psychologists.service';
import { data_providers } from '../constants';
import { Repository } from 'typeorm';
import { Unusual } from './entities/unusual.entity';
import { CreateUnusualDto } from './dto/create-unusual.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { AvailableTimeDto } from './dto/create-agenda.dto';

describe('UnusualService', () => {
  let service: UnusualService;
  let unusualRepository: Repository<Unusual>;
  let psychologistService: PsychologistsService;

  const mockUnusualRepository = {
    save: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
    delete: jest.fn(),
  };

  const mockPsychologistService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnusualService,
        {
          provide: data_providers.UNUSUAL_REPOSITORY,
          useValue: mockUnusualRepository,
        },
        {
          provide: PsychologistsService,
          useValue: mockPsychologistService,
        },
      ],
    }).compile();

    service = module.get<UnusualService>(UnusualService);
    unusualRepository = module.get(data_providers.UNUSUAL_REPOSITORY);
    psychologistService = module.get<PsychologistsService>(PsychologistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockCreateDto: CreateUnusualDto = {
      date: new Date(),
      psychologistId: '123',
      avaliableTimes: [
        { _startTime: '09:00', _endTime: '10:00' } as AvailableTimeDto,
        { _startTime: '10:00', _endTime: '11:00' } as AvailableTimeDto,
      ],
    };

    const mockPsychologist = { id: '123', name: 'Test Psychologist' };

    it('should create unusual times successfully', async () => {
      mockPsychologistService.findOne.mockResolvedValue(mockPsychologist);
      mockUnusualRepository.save.mockResolvedValue([]);

      await service.create(mockCreateDto);

      expect(psychologistService.findOne).toHaveBeenCalledWith('123', false);
      expect(unusualRepository.save).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockPsychologistService.findOne.mockRejectedValue(new Error('Test error'));

      await expect(service.create(mockCreateDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all unusual times', async () => {
      const mockUnusuals = [{ id: '1' }, { id: '2' }];
      mockUnusualRepository.find.mockResolvedValue(mockUnusuals);

      const result = await service.findAll();

      expect(result).toEqual(mockUnusuals);
      expect(unusualRepository.find).toHaveBeenCalled();
    });
  });

  describe('findAllFromPsychologist', () => {
    it('should return all unusual times for a psychologist', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockUnusualRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAllFromPsychologist('123');

      expect(unusualRepository.createQueryBuilder).toHaveBeenCalledWith('unusual');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'unusual.Psychologist_id = :id',
        { id: '123' },
      );
    });
  });

  describe('remove', () => {
    it('should remove an unusual time', async () => {
      const mockResult = { affected: 1 };
      mockUnusualRepository.delete.mockResolvedValue(mockResult);

      const result = await service.remove('123');

      expect(result).toEqual(mockResult);
      expect(unusualRepository.delete).toHaveBeenCalledWith('123');
    });
  });
});