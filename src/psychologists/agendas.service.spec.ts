import { Test, TestingModule } from '@nestjs/testing';
import { AgendasService } from './agendas.service';
import { Agenda } from './entities/agenda.entity';
import { Repository } from 'typeorm';
import { PsychologistsService } from './psychologists.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { Psychologist } from './entities/psychologist.entity';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Day } from './vo/days.enum';
import { Crp } from './vo/crp.vo';
import { Id } from '../entity-base/vo/id.vo';

describe('AgendasService', () => {
  let service: AgendasService;
  let psychologistService: PsychologistsService;

  let mockRepository: Partial<Record<keyof Repository<Agenda>, jest.Mock>>;
  let mockQueryBuilder: Partial<{
    where: jest.Mock;
    select: jest.Mock;
    getOneOrFail: jest.Mock;
    getMany: jest.Mock;
    leftJoinAndSelect: jest.Mock;
    orderBy: jest.Mock;
    addOrderBy: jest.Mock;
  }> = {
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getOneOrFail: jest.fn(),
    getMany: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOneOrFail: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgendasService,
        {
          provide: 'AGENDA_REPOSITORY',
          useValue: mockRepository,
        },
        {
          provide: PsychologistsService,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AgendasService>(AgendasService);
    psychologistService =
      module.get<PsychologistsService>(PsychologistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create agendas and update psychologist', async () => {
      const crp = new Crp({
        crp: '00/123456',
        crpLink: 'teste.com',
      });
      const psychologistId = new Id('psychologist-id');

      const psychologist = new Psychologist({
        id: psychologistId,
        meetValue: 200,
        meetDuration: 50,
        crp,
      });

      const createAgendaDto: CreateAgendaDto = {
        psychologistId: 'psychologist-id',
        meetValue: 250,
        meetDuration: 60,
        agendas: [
          {
            _day: 'SEGUNDA' as Day,
            _avaliableTimes: [
              { _startTime: '08:00', _endTime: '12:00', id: '' },
            ],
          },
        ],
      };

      jest
        .spyOn(psychologistService, 'findOne')
        .mockResolvedValue(psychologist);
      jest.spyOn(mockRepository, 'save').mockResolvedValue({} as Agenda);
      jest.spyOn(psychologistService, 'update').mockResolvedValue(psychologist);
      mockQueryBuilder.getMany.mockReturnValue([]);
      const result = await service.create(createAgendaDto);

      expect(psychologistService.findOne).toHaveBeenCalledWith(
        'psychologist-id'
      );
      expect(psychologistService.update).toHaveBeenCalledWith(
        'psychologist-id',
        {
          meetValue: 250,
          meetDuration: 60,
        }
      );
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException if an error occurs', async () => {
      const createAgendaDto: CreateAgendaDto = {
        psychologistId: 'psychologist-id',
        meetValue: 250,
        meetDuration: 60,
        agendas: [],
      };

      jest
        .spyOn(psychologistService, 'findOne')
        .mockRejectedValue(new Error('Error'));

      await expect(service.create(createAgendaDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('findAll', () => {
    it('should return all agendas', async () => {
      const agendas = [
        new Agenda({
          day: 'SEGUNDA' as Day,
          startTime: '08:00',
          endTime: '12:00',
        }),
        new Agenda({
          day: 'TERCA' as Day,
          startTime: '10:00',
          endTime: '14:00',
        }),
      ];

      jest.spyOn(mockRepository, 'createQueryBuilder').mockReturnValueOnce({
        getMany: jest.fn().mockResolvedValue(agendas),
      } as any);

      const result = await service.findAll();

      expect(result).toEqual(agendas);
    });
  });

  describe('findAllFromPsychologist', () => {
    it('should return agendas for a specific psychologist', async () => {
      const psychologistId = 'psychologist-id';
      const psychologist = new Psychologist({
        id: new Id(psychologistId),
        meetValue: 200,
        meetDuration: 50,
      });

      const mockAgendas = [
        {
          day: 'SEGUNDA' as Day,
          startTime: '08:00',
          endTime: '12:00',
          id: new Id('agenda-id'),
        },
        {
          day: 'TERCA' as Day,
          startTime: '10:00',
          endTime: '14:00',
          id: new Id('agenda-id-2'),
        },
      ];

      jest
        .spyOn(psychologistService, 'findOne')
        .mockResolvedValue(psychologist);
      jest.spyOn(mockRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockAgendas),
      } as any);

      const result = await service.findAllFromPsychologist(psychologistId);

      expect(psychologistService.findOne).toHaveBeenCalledWith(psychologistId);
      expect(result.psychologistId).toBe(psychologistId);
      expect(result.meetDuration).toBe(psychologist.meetDuration);
      expect(result.meetValue).toBe(psychologist.meetValue);
      expect(result.agendas.length).toBe(2); // Verificando o número de agendas retornadas

      expect(result.agendas).toEqual([
        {
          _day: 'SEGUNDA',
          _avaliableTimes: [
            {
              _startTime: '08:00',
              _endTime: '12:00',
              id: 'agenda-id',
            },
          ],
        },
        {
          _day: 'TERCA',
          _avaliableTimes: [
            {
              _startTime: '10:00',
              _endTime: '14:00',
              id: 'agenda-id-2',
            },
          ],
        },
      ]);
    });

    it('should throw BadRequestException if an error occurs', async () => {
      const psychologistId = 'psychologist-id';

      jest
        .spyOn(psychologistService, 'findOne')
        .mockRejectedValue(new Error('Error'));

      await expect(
        service.findAllFromPsychologist(psychologistId)
      ).rejects.toThrow(NotFoundException);
    });
  });
});
