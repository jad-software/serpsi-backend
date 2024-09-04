import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { data_providers } from '../constants';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Id } from '../entity-base/vo/id.vo';
import { PaymentPlan } from './vo/PaymentPlan.enum';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/school/create-school.dto';
import { UpdateSchoolDto } from './dto/school/update-school.dto';

describe('PatientsService', () => {
  let service: PatientsService;
  let mockRepository: Partial<Record<keyof Repository<Patient>, jest.Mock>>;
  let mockQueryBuilder: Partial<{
    where: jest.Mock;
    select: jest.Mock;
    getOneOrFail: jest.Mock;
  }> = {
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getOneOrFail: jest.fn(),
  };
  const mockSchoolService = {
    create: jest.fn((dto: CreateSchoolDto) => ({
      id: '1',
      ...dto,
    })),
    findAll: jest.fn(() => [
      { id: '1', name: 'ativa idade', CNPJ: '00.000.0000/0001-00' },
      { id: '2', name: 'coperil', CNPJ: '00.000.0000/0001-01' },
    ]),
    findOneBy: jest.fn((search: UpdateSchoolDto) => ({
      id: '1',
      name: 'ativa idade',
      CNPJ: '00.000.0000/0001-00',
    })),
    findOne: jest.fn((id: string) => ({
      id: '1',
      name: 'ativa idade',
      CNPJ: '00.000.0000/0001-00',
    })),
    remove: jest.fn((id: string) => ({ id })),
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
        PatientsService,
        {
          provide: data_providers.PATIENT_REPOSITORY,
          useValue: mockRepository,
        },
        {
          provide: SchoolService,
          useValue: mockSchoolService,
        }
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve all patient', async () => {
    const patients: Patient[] = [
      new Patient({
        paymentPlan: PaymentPlan.MENSAL,
      }),
      new Patient({
        paymentPlan: PaymentPlan.BIMESTRAL,
      }),
    ];
    mockRepository.find.mockResolvedValue(patients);

    expect(await service.findAll()).toEqual(patients);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should return a patient by id', async () => {
    const patient: Patient = {
      id: new Id('f0846568-2bd9-450d-95e3-9a478e20e74b'),
    } as Patient;
    mockRepository.findOneOrFail.mockResolvedValue(patient);

    expect(
      await service.findOne('f0846568-2bd9-450d-95e3-9a478e20e74b')
    ).toEqual(patient);
    expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
      where: {
        _id: {
          _id: 'f0846568-2bd9-450d-95e3-9a478e20e74b',
        },
      },
    });
  });

  it('should update a patient by id', async () => {
    const updatePatientDTO: UpdatePatientDto = {};
    const expectedPatient: Patient = new Patient({});

    mockRepository.update.mockResolvedValue({ affected: 1 });
    mockRepository.findOneOrFail.mockResolvedValue(expectedPatient);

    expect(
      await service.update(
        'f0846568-2bd9-450d-95e3-9a478e20e74b',
        updatePatientDTO
      )
    ).toEqual(expectedPatient);
    expect(mockRepository.update).toHaveBeenCalledWith(
      'f0846568-2bd9-450d-95e3-9a478e20e74b',
      expectedPatient
    );
  });

  it('should remove a patient by id', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });

    await service.remove('f0846568-2bd9-450d-95e3-9a478e20e74b');
    expect(mockRepository.delete).toHaveBeenCalledWith(
      'f0846568-2bd9-450d-95e3-9a478e20e74b'
    );
  });
});
