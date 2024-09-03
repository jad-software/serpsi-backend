import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { data_providers } from '../constants';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Id } from '../entity-base/vo/id.vo';
import { PaymentPlan } from './vo/PaymentPlan.enum';

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
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve all users', async () => {
    const users: Patient[] = [
      new Patient({
        paymentPlan: PaymentPlan.MENSAL,
      }),
      new Patient({
        paymentPlan: PaymentPlan.BIMESTRAL,
      }),
    ];
    mockRepository.find.mockResolvedValue(users);

    expect(await service.findAll()).toEqual(users);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should return a user by id', async () => {
    const email = 'john@example.com';
    const user: Patient = {
      id: new Id('f0846568-2bd9-450d-95e3-9a478e20e74b'),
    } as Patient;
    mockRepository.findOneOrFail.mockResolvedValue(user);

    expect(
      await service.findOne('f0846568-2bd9-450d-95e3-9a478e20e74b')
    ).toEqual(user);
    expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
      where: {
        _id: {
          _id: 'f0846568-2bd9-450d-95e3-9a478e20e74b',
        },
      },
    });
  });

  it('should update a user by id', async () => {
    const updateUserDTO: UpdatePatientDto = {};
    const user: Patient = new Patient({});
    const expectedUser: Patient = new Patient({});

    user.id = new Id('f0846568-2bd9-450d-95e3-9a478e20e74b');

    mockRepository.update.mockResolvedValue({ affected: 1 });
    mockRepository.findOneOrFail.mockResolvedValue(expectedUser);

    expect(
      await service.update(
        'f0846568-2bd9-450d-95e3-9a478e20e74b',
        updateUserDTO
      )
    ).toEqual(expectedUser);
    expect(mockRepository.update).toHaveBeenCalledWith(
      'f0846568-2bd9-450d-95e3-9a478e20e74b',
      expectedUser
    );
  });
  it('should remove a user by id', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });

    await service.remove('f0846568-2bd9-450d-95e3-9a478e20e74b');
    expect(mockRepository.delete).toHaveBeenCalledWith(
      'f0846568-2bd9-450d-95e3-9a478e20e74b'
    );
  });
});
