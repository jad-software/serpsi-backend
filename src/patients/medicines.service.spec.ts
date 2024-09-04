import { Test, TestingModule } from '@nestjs/testing';
import { MedicinesService } from './medicines.service';
import { Repository } from 'typeorm';
import { Medicine } from './entities/medicine.entity';
import { data_providers } from '../constants';
import { Id } from '../entity-base/vo/id.vo';
import { UpdateMedicineDto } from './dto/medicine/update-medicine.dto';

describe('MedicinesService', () => {
  let service: MedicinesService;
  let mockRepository: Partial<Record<keyof Repository<Medicine>, jest.Mock>>;
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
        MedicinesService,
        {
          provide: data_providers.MEDICINE_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MedicinesService>(MedicinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve all medicines', async () => {
    const medicines: Medicine[] = [
      new Medicine({
        name: 'Buscopan',
      }),
      new Medicine({
        name: 'Rivotril',
      }),
    ];
    mockRepository.find.mockResolvedValue(medicines);

    expect(await service.findAll()).toEqual(medicines);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should return a medicine by id', async () => {
    const medicine: Medicine = {
      id: new Id('f0846568-2bd9-450d-95e3-9a478e20e74b'),
    } as Medicine;
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
    const updateMedicineDTO: UpdateMedicineDto = {
      name: 'Buscopan dia a dia',
    };
    const expectedMedicine: Medicine = new Medicine(updateMedicineDTO);
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
