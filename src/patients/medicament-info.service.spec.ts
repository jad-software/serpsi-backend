import { Test, TestingModule } from '@nestjs/testing';
import { MedicamentInfoService } from './medicament-info.service';
import { data_providers } from '../constants';
import { MedicamentInfo } from './entities/medicament-info.entity';
import { Repository } from 'typeorm';
import { UpdateMedicamentInfoDto } from './dto/medicine/update-medicament-info.dto';
import { Id } from '../entity-base/vo/id.vo';
import { MedicinesService } from './medicines.service';

describe('MedicamentInfoService', () => {
  let service: MedicamentInfoService;
  let mockRepository: Partial<
    Record<keyof Repository<MedicamentInfo>, jest.Mock>
  >;
  let mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getOneOrFail: jest.fn(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOneOrFail: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicamentInfoService,
        MedicinesService,
        {
          provide: data_providers.MEDICAMENTINFO_REPOSITORY,
          useValue: mockRepository,
        },
        {
          provide: data_providers.MEDICINE_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MedicamentInfoService>(MedicamentInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve all medicines', async () => {
    const medicines: MedicamentInfo[] = [
      new MedicamentInfo({
        medicine: {
          name: 'Buscopan dia a dia',
        },
        dosage: 250,
        dosageUnity: 'mg',
        frequency: 3,
        firstTimeOfTheDay: new Date('2024-01-01T08:00:00.000Z'),
        startDate: new Date('2024-09-09T00:00:00.000Z'),
        observation: 'só tomar em dias de verão',
      }),
      new MedicamentInfo({
        medicine: {
          name: 'MINOXIDIL',
        },
        dosage: 1000,
        dosageUnity: 'g',
        frequency: 1,
        firstTimeOfTheDay: new Date('2024-01-01T08:00:00.000Z'),
        startDate: new Date('2024-09-09T00:00:00.000Z'),
        observation: 'vai ter barba com 12 anos',
      }),
    ];
    mockRepository.find.mockResolvedValue(medicines);

    expect(await service.findAll()).toEqual(medicines);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should return all medicines by patientId ', async () => {
    const medicament: MedicamentInfo = new MedicamentInfo({});
    medicament.Patient_id = 'f0846568-2bd9-450d-95e3-9a478e20e74b';
    mockQueryBuilder.getMany.mockResolvedValue([medicament]);

    expect(
      await service.findAllToPatient('f0846568-2bd9-450d-95e3-9a478e20e74b')
    ).toEqual([medicament]);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'medicamentInfo.Patient_id = :Patient_id',
      { Patient_id: 'f0846568-2bd9-450d-95e3-9a478e20e74b' }
    );
  });

  it('should return a medicine by id', async () => {
    const medicament: MedicamentInfo = new MedicamentInfo({});
    medicament.Patient_id = 'f0846568-2bd9-450d-95e3-9a478e20e74b';
    medicament.Medicine_id = '2d033352-67a5-404b-86f9-c0f0936308b7';
    mockRepository.findOneOrFail.mockResolvedValue(medicament);

    expect(
      await service.findOne(
        'f0846568-2bd9-450d-95e3-9a478e20e74b',
        '2d033352-67a5-404b-86f9-c0f0936308b7'
      )
    ).toEqual(medicament);
    expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
      where: {
        _medicine_id: '2d033352-67a5-404b-86f9-c0f0936308b7',
        _patient_id: 'f0846568-2bd9-450d-95e3-9a478e20e74b',
      },
    });
  });

  it('should remove a medicine by id', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });

    await service.remove(
      'f0846568-2bd9-450d-95e3-9a478e20e74b',
      '2d033352-67a5-404b-86f9-c0f0936308b7'
    );
    expect(mockRepository.delete).toHaveBeenCalledWith({
      _medicine_id: '2d033352-67a5-404b-86f9-c0f0936308b7',
      _patient_id: 'f0846568-2bd9-450d-95e3-9a478e20e74b',
    });
  });
});
