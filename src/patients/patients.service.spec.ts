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
import { CreateComorbidityDto } from './dto/comorbities/create-comorbidity.dto';
import { ComorbiditiesService } from './comorbidities.service';
import { MedicamentInfoService } from './medicament-info.service';
import { CreateMedicamentInfoDto } from './dto/medicine/create-medicament-info.dto';
import { MedicamentInfo } from './entities/medicament-info.entity';
import { PersonsService } from '../persons/persons.service';
import { Person } from '../persons/entities/person.enitiy';

describe('PatientsService', () => {
  let service: PatientsService;
  let mockRepository: Partial<Record<keyof Repository<Patient>, jest.Mock>>;
  let mockQueryBuilder: Partial<{
    where: jest.Mock;
    select: jest.Mock;
    leftJoinAndSelect: jest.Mock;
    getOneOrFail: jest.Mock;
  }> = {
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
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

  const mockComorbiditiesService = {
    create: jest.fn((dto: CreateComorbidityDto) => ({
      id: '1',
      ...dto,
    })),
    findAll: jest.fn(() => [
      { id: '1', name: 'Buscopan' },
      { id: '2', name: 'Loratadina' },
    ]),
    findByName: jest.fn((name: string) => ({
      id: '1',
      name: 'Buscopan',
    })),
    findOne: jest.fn((id: string) => ({
      id: '1',
      name: 'Buscopan',
    })),
    remove: jest.fn((id: string) => ({ id })),
  };

  const mockMedicamentInfoService = {
    create: jest.fn((dto: CreateMedicamentInfoDto, patient: Patient) => ({
      id: '1',
      ...dto,
    })),
    findAll: jest.fn(() => [
      {
        patient_id: '1',
        medicine_id: '1',
        dosage: 250,
        dosageUnity: 'mg',
        frequency: 2,
        firstTimeOfTheDay: '2024-01-01T08:00:00.000Z',
        startDate: '2024-07-20T00:00:00.000Z',
        observation: 'Tomar antes de comer',
      },
      {
        patient_id: '1',
        medicine_id: '2',
        dosage: 250,
        dosageUnity: 'mg',
        frequency: 2,
        firstTimeOfTheDay: '2024-01-01T08:00:00.000Z',
        startDate: '2024-07-20T00:00:00.000Z',
        observation: 'Tomar antes de comer',
      },
    ]),
    findAllToPatient: jest.fn((Patient_id: string): MedicamentInfo[] => [
      {
        Patient_id: '1',
        Medicine_id: '1',
        dosage: 250,
        dosageUnity: 'mg',
        frequency: 2,
        firstTimeOfTheDay: new Date('2024-01-01T08:00:00.000Z'),
        startDate: new Date('2024-07-20T00:00:00.000Z'),
        observation: 'Tomar antes de comer',
      } as MedicamentInfo,
      {
        Patient_id: '1',
        Medicine_id: '2',
        dosage: 250,
        dosageUnity: 'mg',
        frequency: 2,
        firstTimeOfTheDay: new Date('2024-01-01T08:00:00.000Z'),
        startDate: new Date('2024-07-20T00:00:00.000Z'),
        observation: 'Tomar antes de comer',
      } as MedicamentInfo,
    ]),
    findOne: jest.fn((patient_id: string, medicament_id: string) => ({
      patient_id: '1',
      medicine_id: '2',
      dosage: 250,
      dosageUnity: 'mg',
      frequency: 2,
      firstTimeOfTheDay: '2024-01-01T08:00:00.000Z',
      startDate: '2024-07-20T00:00:00.000Z',
      observation: 'Tomar antes de comer',
    })),
    remove: jest.fn((patient_id: string, medicament_id: string) => ({
      patient_id,
      medicament_id,
    })),
  };
  const mockPersonsService = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn().mockResolvedValue({}), // Ajuste aqui, se necessário
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
        },
        {
          provide: ComorbiditiesService,
          useValue: mockComorbiditiesService,
        },
        {
          provide: MedicamentInfoService,
          useValue: mockMedicamentInfoService,
        },
        {
          provide: PersonsService,
          useValue: mockPersonsService,
        },
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
    mockQueryBuilder.getOneOrFail.mockResolvedValue(patient);

    expect(
      await service.findOne('f0846568-2bd9-450d-95e3-9a478e20e74b')
    ).toEqual(patient);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('patient.id = :id', {
      id: 'f0846568-2bd9-450d-95e3-9a478e20e74b',
    });
  });

  it('should update a patient by id', async () => {
    const updatePatientDTO: UpdatePatientDto = {
      paymentPlan: PaymentPlan.BIMESTRAL,
    };
    const expectedPatient: Patient = new Patient(updatePatientDTO);
    expectedPatient.id = new Id('f0846568-2bd9-450d-95e3-9a478e20e74b');
    mockRepository.update.mockResolvedValue({ affected: 1 });
    mockQueryBuilder.getOneOrFail.mockResolvedValue(expectedPatient);

    expect(
      await service.update(
        'f0846568-2bd9-450d-95e3-9a478e20e74b',
        updatePatientDTO
      )
    ).toEqual(expectedPatient);
    expect(mockRepository.update).toHaveBeenCalledWith(
      'f0846568-2bd9-450d-95e3-9a478e20e74b',
      new Patient(updatePatientDTO)
    );
  });

  it('should remove a patient by id', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });
    let patient = new Patient({});
    patient.id = new Id('f0846568-2bd9-450d-95e3-9a478e20e74b');
    patient.person = new Person({});
    patient.person.id = new Id('f0846568-2bd9-450d-95e3-9a478e');

    mockQueryBuilder.getOneOrFail.mockResolvedValue(patient);
    await service.remove(patient.id.id);

    // Verificando se a função delete foi chamada no personsService
    expect(mockPersonsService.delete).toHaveBeenCalledWith(
      patient.person.id.id
    );

    expect(mockRepository.delete).toHaveBeenCalledWith(
      'f0846568-2bd9-450d-95e3-9a478e20e74b'
    );
  });
});
