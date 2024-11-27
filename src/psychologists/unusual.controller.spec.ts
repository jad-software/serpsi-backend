import { Test, TestingModule } from '@nestjs/testing';
import { UnusualController } from './unusual.controller';
import { UnusualService } from './unusual.service';
import { CreateUnusualDto } from './dto/create-unusual.dto';
import { BadRequestException } from '@nestjs/common';
import { AvailableTimeDto } from './dto/create-agenda.dto';

describe('UnusualController', () => {
  let controller: UnusualController;
  let service: UnusualService;

  const mockUnusualService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllFromPsychologist: jest.fn(),
    remove: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnusualController],
      providers: [
        {
          provide: UnusualService,
          useValue: mockUnusualService
        }
      ]
    }).compile();

    controller = module.get<UnusualController>(UnusualController);
    service = module.get<UnusualService>(UnusualService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create unusual schedules successfully', async () => {
      const createDto: CreateUnusualDto[] = [
        {
          date: new Date('2023-01-01'),
          psychologistId: '1',
          avaliableTimes: [
            {
              _startTime: '09:00',
              _endTime: '10:00'
            } as AvailableTimeDto
          ]
        }
      ];

      mockUnusualService.create.mockResolvedValue(createDto[0]);

      const result = await controller.create(createDto);
      expect(result).toEqual([createDto[0]]);
    });

    it('should throw BadRequestException when times are invalid', async () => {
      const createDto: CreateUnusualDto[] = [
        {
          date: new Date('2023-01-01'),
          psychologistId: '1',
          avaliableTimes: [
            {
              _startTime: '10:00',
              _endTime: '09:00'
            } as AvailableTimeDto
          ]
        }
      ];

      await expect(controller.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when times are empty', async () => {
      const createDto: CreateUnusualDto[] = [
        {
          date: new Date('2023-01-01'),
          psychologistId: '1',
          avaliableTimes: [
            {
              _startTime: '',
              _endTime: ''
            } as AvailableTimeDto
          ]
        }
      ];

      await expect(controller.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all unusual schedules', async () => {
      const expected = [{ id: '1', avaliableTimes: [] }];
      mockUnusualService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return unusual schedules for a specific psychologist', async () => {
      const expected = [{ id: '1', avaliableTimes: [] }];
      mockUnusualService.findAllFromPsychologist.mockResolvedValue(expected);

      const result = await controller.findOne('1');
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should remove an unusual schedule', async () => {
      const expected = { id: '1', avaliableTimes: [] };
      mockUnusualService.remove.mockResolvedValue(expected);

      const result = await controller.remove('1');
      expect(result).toEqual(expected);
    });
  });
});