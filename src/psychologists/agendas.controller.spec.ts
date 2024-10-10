import { Test, TestingModule } from '@nestjs/testing';
import { AgendasController } from './agendas.controller';
import { AgendasService } from './agendas.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { BadRequestException } from '@nestjs/common';
import { Day } from './vo/days.enum';

describe('AgendasController', () => {
  let controller: AgendasController;
  let service: AgendasService;

  const mockAgendasService = {
    create: jest.fn((dto: CreateAgendaDto) => ({ id: '1', ...dto })),
    findAll: jest.fn(() => [
      { id: '1', psychologistId: '123', meetValue: 150, meetDuration: 50, agendas: [] },
    ]),
    findAllFromPsychologist: jest.fn((id: string) => ({
      id,
      psychologistId: id,
      meetValue: 150,
      meetDuration: 50,
      agendas: [],
    })),
    update: jest.fn((id: string, dto: UpdateAgendaDto) => ({ id, ...dto })),
    remove: jest.fn((id: string) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgendasController],
      providers: [{ provide: AgendasService, useValue: mockAgendasService }],
    }).compile();

    controller = module.get<AgendasController>(AgendasController);
    service = module.get<AgendasService>(AgendasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('validateAvaliableTime', () => {
    it('should throw an error if startTime or endTime is empty', () => {
      const dto: CreateAgendaDto = {
        psychologistId: '123',
        meetValue: 150,
        meetDuration: 50,
        agendas: [
          {
            _day: 'SEGUNDA' as Day,
            _avaliableTimes: [{ _startTime: '', _endTime: '10:00', id: '1' }],
          },
        ],
      };
  
      expect(() => controller.validateAvaliableTime(dto)).toThrow(BadRequestException);
    });
  
    it('should throw an error if endTime is before startTime', () => {
      const dto: CreateAgendaDto = {
        psychologistId: '123',
        meetValue: 150,
        meetDuration: 50,
        agendas: [
          {
            _day: 'SEGUNDA' as Day,
            _avaliableTimes: [{ _startTime: '10:00', _endTime: '09:00', id: '1' }],
          },
        ],
      };
  
      expect(() => controller.validateAvaliableTime(dto)).toThrow(BadRequestException);
    });
  
    it('should pass validation with correct times', () => {
      const dto: CreateAgendaDto = {
        psychologistId: '123',
        meetValue: 150,
        meetDuration: 50,
        agendas: [
          {
            _day: 'SEGUNDA' as Day,
            _avaliableTimes: [
              { _startTime: '09:00', _endTime: '10:00', id: '1' },
            ],
          },
        ],
      };
  
      expect(() => controller.validateAvaliableTime(dto)).not.toThrow();
    });
  });

  describe('create', () => {
    it('should create an agenda', async () => {
      const dto: CreateAgendaDto = {
        psychologistId: '123',
        meetValue: 150,
        meetDuration: 50,
        agendas: [
          {
            _day: 'SEGUNDA' as Day,
            _avaliableTimes: [
              { _startTime: '09:00', _endTime: '10:00', id: '1' },
            ],
          },
        ],
      };
  
      expect(await controller.create(dto)).toEqual({ id: '1', ...dto });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });
  
  describe('findAll', () => {
    it('should return an array of agendas', async () => {
      expect(await controller.findAll()).toEqual([
        { id: '1', psychologistId: '123', meetValue: 150, meetDuration: 50, agendas: [] },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return agendas for a psychologist by id', async () => {
      const id = '123';
      expect(await controller.findOne(id)).toEqual({
        id,
        psychologistId: id,
        meetValue: 150,
        meetDuration: 50,
        agendas: [],
      });
      expect(service.findAllFromPsychologist).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update an agenda by id', async () => {
      const id = '1';
      const dto: UpdateAgendaDto = {
        meetValue: 200,
        meetDuration: 60,
        agendas: [],
      };
      expect(await controller.update(id, dto)).toEqual({ id, ...dto });
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should remove an agenda by id', async () => {
      const id = '1';
      expect(await controller.remove(id)).toEqual({ id });
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
