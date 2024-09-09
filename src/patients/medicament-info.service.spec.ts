import { Test, TestingModule } from '@nestjs/testing';
import { MedicamentInfoService } from './medicament-info.service';
import { data_providers } from '../constants';
import { MedicamentInfo } from './entities/medicament-info.entity';
import { Repository } from 'typeorm';
import { UpdateMedicamentInfoDto } from './dto/medicine/update-medicament-info.dto';
import { Id } from '../entity-base/vo/id.vo';

describe('MedicamentInfoService', () => {
  let service: MedicamentInfoService;
  let mockRepository: Partial<
    Record<keyof Repository<MedicamentInfo>, jest.Mock>
  >;
  let mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getOneOrFail: jest.fn(),
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
        {
          provide: data_providers.MEDICAMENTINFO_REPOSITORY,
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
        medicament: {
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
        medicament: {
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

  it('should return a medicine by id', async () => {
    const medicine: MedicamentInfo = {
      id: new Id('f0846568-2bd9-450d-95e3-9a478e20e74b'),
    } as MedicamentInfo;
    mockRepository.findOneOrFail.mockResolvedValue(medicine);

    expect(
      await service.findOne('f0846568-2bd9-450d-95e3-9a478e20e74b')
    ).toEqual(medicine);
    expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
      where: {
        _id: {
          _id: 'f0846568-2bd9-450d-95e3-9a478e20e74b',
        },
      },
    });
  });

  it('should update a medicine by id', async () => {
    const updateMedicineDTO: UpdateMedicamentInfoDto = {
      medicament: {
        name: 'Buscopan dia a dia',
      },
      dosage: 250,
      dosageUnity: 'mg',
      frequency: 3,
      firstTimeOfTheDay: new Date('2024-01-01T08:00:00.000Z'),
      startDate: new Date('2024-09-09T00:00:00.000Z'),
      observation: 'só tomar em dias de verão',
    };
    const expectedMedicine: MedicamentInfo = new MedicamentInfo(
      updateMedicineDTO
    );
    mockRepository.findOneOrFail.mockResolvedValue(expectedMedicine);
    mockRepository.update.mockResolvedValue({ affected: 1 });

    expect(
      await service.update(
        'f0846568-2bd9-450d-95e3-9a478e20e74b',
        updateMedicineDTO
      )
    ).toEqual(expectedMedicine);
    expect(mockRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    expect(mockRepository.update).toHaveBeenCalledWith(
      'f0846568-2bd9-450d-95e3-9a478e20e74b',
      expectedMedicine
    );
  });

  it('should remove a medicine by id', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });

    await service.remove('f0846568-2bd9-450d-95e3-9a478e20e74b');
    expect(mockRepository.delete).toHaveBeenCalledWith(
      'f0846568-2bd9-450d-95e3-9a478e20e74b'
    );
  });
});
