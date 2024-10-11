import { Test, TestingModule } from '@nestjs/testing';
import { PsychologistsController } from './psychologists.controller';
import { PsychologistsService } from './psychologists.service';
import { CreatePsychologistDto } from './dto/create-psychologist.dto';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';
import { Phone } from '../persons/vo/phone.vo';
import { Cpf } from '../persons/vo/cpf.vo';
import { Address } from '../addresses/entities/address.entity';

describe('PsychologistsController', () => {
  let controller: PsychologistsController;
  let service: PsychologistsService;
  const mockPsychologistService = {
    create: jest.fn((
      dto: CreatePsychologistDto, 
      profilePicture: Express.Multer.File, 
      crpfile: Express.Multer.File,
      identifyfile: Express.Multer.File,
      degreeFile: Express.Multer.File
   ) => ({
      id: '1',
      ...dto,
      profilePicture: 'profilePictureLink.com',
      crpfile: 'crpfileLink.com',
      identifyfile: 'identifyfileLink.com',
      degreeFile: 'degreeFileLink.com'
   })),
    findAll: jest.fn(() => [
      { id: '1', identifyLink: '123', meetValue: 150, meetDuration: 50, crp: {
        crp: 'crp',
        crpLink:'crpLink.com'
      },
      degreeLink: 'degreeLink.com'
     },

    ]),
      
    update: jest.fn((id: string, dto: UpdatePsychologistDto) => ({ id, ...dto })),
    remove: jest.fn((id: string) => ({ id })),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PsychologistsController],
      providers: [{provide: PsychologistsService, useValue: mockPsychologistService}],
    }).compile();

    controller = module.get<PsychologistsController>(PsychologistsController);
    service = module.get<PsychologistsService>(PsychologistsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
  
  describe('create', () => {
    it('should create a psychologist with the provided files and data', async () => {
      const files = [
        { fieldname: 'profilePicture', originalname: 'profile.jpg' },
        { fieldname: 'crpFile', originalname: 'crp.pdf' },
        { fieldname: 'identifyfile', originalname: 'id.pdf' },
        { fieldname: 'degreeFile', originalname: 'degree.pdf' },
      ] as Express.Multer.File[];
  
      const cpf = {
        cpf: '123.456.789-00',
      } as Cpf;

      const psychologistData = {
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
        }
        ,
        user: { email: 'john@example.com', password: 'Password@123', role: 'PSI' },
        crp: { crp: '00/123456' },
        meetValue: 100,
        meetDuration: 60,
      };
  
      const psychologistDataString = JSON.stringify(psychologistData);
  
      await controller.create(files, psychologistDataString);
      
      expect(service.create).toHaveBeenCalledWith(
        expect.any(CreatePsychologistDto), 
        files[0], // profilePicture
        files[1], // crpFile
        files[2], // identifyfile
        files[3], // degreeFile
      );
    });
  });
  
});
