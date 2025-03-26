import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';
import { Phone } from '../persons/vo/phone.vo';
import { Cpf } from '../persons/vo/cpf.vo';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with user data', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      const mockReq = { user: mockUser };

      await controller.login(mockReq);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      const mockUser = { id: 1, email: 'test@test.com' };

      const result = controller.getProfile(mockUser);

      expect(result).toEqual(mockUser);
    });
  });

  describe('registerPsychologist', () => {
    it('should register a new psychologist', async () => {
      const mockFiles = [
        {
          fieldname: 'profilePicture',
          originalname: 'profile.jpg',
          mimetype: 'image/jpeg'
        },
        {
          fieldname: 'crpFile',
          originalname: 'crp.pdf',
          mimetype: 'application/pdf'
        },
        {
          fieldname: 'identifyfile',
          originalname: 'id.pdf',
          mimetype: 'application/pdf'
        },
        {
          fieldname: 'degreeFile',
          originalname: 'degree.pdf',
          mimetype: 'application/pdf'
        }
      ] as Array<Express.Multer.File>;
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
            homeNumber: '10',
            complement: 'Complement de Address teste',
          },
        },
        user: {
          email: 'john@example.com',
          password: 'Password@123',
          role: 'PSI',
        },
        crp: { crp: '00/123456' },
        meetValue: 100,
        meetDuration: 60,
      };

      const mockPsychologistData = JSON.stringify(psychologistData);

      const expectedResult = { id: 1, ...JSON.parse(mockPsychologistData) };
      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.registerPsychologist(mockFiles, mockPsychologistData);

      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException for invalid file type', async () => {
      const mockFiles = [
        {
          fieldname: 'profilePicture',
          originalname: 'profile.gif',
          mimetype: 'image/gif'
        }
      ] as Array<Express.Multer.File>;

      const mockPsychologistData = JSON.stringify({});

      await expect(
        controller.registerPsychologist(mockFiles, mockPsychologistData)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateUploadedFile', () => {
    it('should throw BadRequestException when required file is missing', () => {
      expect(() => {
        controller['validateUploadedFile'](undefined, ['jpg'], true);
      }).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid file type', () => {
      const mockFile = {
        originalname: 'test.gif'
      } as Express.Multer.File;

      expect(() => {
        controller['validateUploadedFile'](mockFile, ['jpg', 'png'], true);
      }).toThrow(BadRequestException);
    });

    it('should not throw error for valid file type', () => {
      const mockFile = {
        originalname: 'test.jpg'
      } as Express.Multer.File;

      expect(() => {
        controller['validateUploadedFile'](mockFile, ['jpg', 'png'], true);
      }).not.toThrow();
    });
  });
});