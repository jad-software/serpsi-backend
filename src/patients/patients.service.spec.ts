import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';
import { Patient } from './entities/patient.entity';
import { data_providers } from '../constants';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Id } from '../entity-base/vo/id.vo';
import { PaymentPlan } from './vo/PaymentPlan.enum';
import { SchoolService } from './school.service';
import { ComorbiditiesService } from './comorbidities.service';
import { MedicamentInfoService } from './medicament-info.service';
import { PersonsService } from '../persons/persons.service';
import { Person } from '../persons/entities/person.enitiy';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { DocumentsService } from '../documents/documents.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Cpf } from 'src/persons/vo/cpf.vo';

describe('PatientsService', () => {
  let service: PatientsService;

  let mockQueryBuilder: Partial<{
    save: jest.Mock;
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

  const mockRepository = {
    manager: {
      connection: {
        createQueryRunner: jest.fn().mockReturnValue({
          startTransaction: jest.fn(),
          commitTransaction: jest.fn(),
          rollbackTransaction: jest.fn(),
        }),
      },
    },
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockSchoolService = {
    findOneBy: jest.fn(),
    create: jest.fn(),
  };

  const mockComorbiditiesService = {
    findByName: jest.fn(),
    create: jest.fn(),
  };

  const mockMedicamentInfoService = {
    create: jest.fn(),
    findAllToPatient: jest.fn(),
    remove: jest.fn(),
  };

  const mockPersonsService = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockDocumentsService = {
    findAllByPatient: jest.fn(),
  };

  const mockCloudinaryService = {
    deleteFileOtherThanImage: jest.fn(),
  };

  beforeEach(async () => {
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
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
        {
          provide: DocumentsService,
          useValue: mockDocumentsService,
        },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and save a new patient', async () => {
    const cpf = {
      cpf: '',
    } as Cpf;
    const createPatientDto: CreatePatientDto = {
      paymentPlan: PaymentPlan.MENSAL,
      person: {
        rg: '',
        birthdate: undefined,
        name: '',
        phone: undefined,
        cpf,
        address: {
          zipCode: '',
          street: '',
          district: '',
          city: '',
          state: '',
          homeNumber: 0,
          complement: '',
        },
      },
      school: {
        name: '',
        CNPJ: '',
        address: undefined,
        phone: undefined,
      },
      comorbidities: [],
      medicines: [],
      parents: [],
    };
    const mockPatient = new Patient({});
    mockRepository.create.mockReturnValue(mockPatient);
    mockPersonsService.create.mockResolvedValue({});
    mockSchoolService.findOneBy.mockResolvedValue({});
    mockComorbiditiesService.create.mockResolvedValue({});
    mockMedicamentInfoService.create.mockResolvedValue({});
    mockRepository.save.mockResolvedValue(mockPatient);

    let profilePicture = {
      originalname: 'teste.png',
    } as Express.Multer.File;

    const result = await service.create(createPatientDto, profilePicture);

    expect(result).toEqual(mockPatient);
    expect(mockRepository.create).toHaveBeenCalledWith(expect.any(Patient));
    expect(mockRepository.save).toHaveBeenCalledWith(mockPatient, {
      transaction: false,
    });
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
