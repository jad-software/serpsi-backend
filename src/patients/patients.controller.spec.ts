import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PaymentPlan } from './vo/PaymentPlan.enum';
import { Cpf } from '../persons/vo/cpf.vo';
import { Phone } from '../persons/vo/phone.vo';
import { Address } from '../addresses/entities/address.entity';

describe('PatientsController', () => {
  let controller: PatientsController;
  let service: PatientsService;
  const mockService = {
    create: jest.fn((dto: CreatePatientDto) => ({
      id: '1',
      ...dto,
    })),
    findAll: jest.fn(() => [
      { id: '1', paymentPlan: PaymentPlan.BIMESTRAL },
      { id: '2', paymentPlan: PaymentPlan.MENSAL },
    ]),
    findOne: jest.fn((id: string) => ({
      id,
      paymentPlan: PaymentPlan.MENSAL,
    })),
    update: jest.fn((id: string, dto: UpdatePatientDto) => ({ id, ...dto })),
    remove: jest.fn((id: string) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        {
          provide: PatientsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a Patient', async () => {
      const cpf = {
        cpf: '123.456.789-00',
      } as Cpf;

      const schoolAddress = {
        zipCode: '44444-44',
        state: 'BA',
        street: 'Rua de Address teste',
        city: 'cidade',
        district: 'District de Address teste',
        homeNumber: 10,
        complement: 'Complement de Address teste',
      } as Address;
      const dto: CreatePatientDto = {
        paymentPlan: PaymentPlan.BIMESTRAL,
        psychologistId: 'psychologist-id',
        school: {
          name: 'ativa idade',
          CNPJ: '00.000.000/0001-00',
          phone: new Phone({ ddi: '+1', ddd: '123', number: '4567890' }),
          address: schoolAddress,
        },
        person: {
          rg: '98.747.153-7',
          birthdate: new Date('2000-01-01'),
          name: 'name de teste',
          cpf,
          phone: new Phone({ ddi: '+1', ddd: '123', number: '4567890' }),
          address: {
            zipCode: '44444-44',
            state: 'BA',
            street: 'Rua de Address teste',
            city: 'cidade',
            district: 'District de Address teste',
            homeNumber: 10,
            complement: 'Complement de Address teste',
          },
        },
        comorbidities: [],
        medicines: [],
        parents: [],
      };

      let previusFollowUps = [
        {
          originalname: 'Title Controller teste.pdf',
          fieldname: 'documents',
        },
        {
          originalname: 'Title Controller teste2.pdf',
          fieldname: 'documents',
        },
        {
          originalname: 'teste.png',
          fieldname: 'profilePicture',
        },
      ] as Express.Multer.File[];

      const profilePicture = previusFollowUps.find(
        (file) => file.fieldname === 'profilePicture'
      );
      const documents = previusFollowUps.filter(
        (file) => file.fieldname === 'documents'
      );

      expect(
        await controller.create(previusFollowUps, JSON.stringify(dto))
      ).toEqual({ id: '1', ...dto });
      expect(service.create).toHaveBeenCalledWith(
        dto,
        profilePicture,
        documents
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of patients', async () => {
      expect(await controller.findAll()).toEqual([
        { id: '1', paymentPlan: PaymentPlan.BIMESTRAL },
        { id: '2', paymentPlan: PaymentPlan.MENSAL },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a patient by id', async () => {
      const id = '1';
      expect(await controller.findOne(id)).toEqual({
        id,
        paymentPlan: PaymentPlan.MENSAL,
      });
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a patient by id', async () => {
      const id = '1';
      const dto: UpdatePatientDto = {
        paymentPlan: PaymentPlan.MENSAL,
      };
      expect(await controller.update(id, dto)).toEqual({ id, ...dto });
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should remove a pacient by id', async () => {
      const id = '1';
      expect(await controller.remove(id)).toEqual({ id });
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
