import { Test, TestingModule } from '@nestjs/testing';
import { SchoolService } from './school.service';
import { Repository } from 'typeorm';
import { School } from './entities/school.entity';
import { data_providers } from '../constants';
import { Id } from '../entity-base/vo/id.vo';
import { UpdateSchoolDto } from './dto/school/update-school.dto';

describe('SchoolService', () => {
  let service: SchoolService;
  let mockRepository: Partial<Record<keyof Repository<School>, jest.Mock>>;
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
        SchoolService,
        {
          provide: data_providers.SCHOOL_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SchoolService>(SchoolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve all schools', async () => {
    const school: School[] = [
      new School({
        name: 'ativa idade irece',
        CNPJ: '12.123.1234/0001-10',
      }),
      new School({
        name: 'coperil',
        CNPJ: '43.432.4321/0001-10',
      }),
    ];
    mockRepository.find.mockResolvedValue(school);

    expect(await service.findAll()).toEqual(school);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should return a school by id', async () => {
    const school: School = {
      id: new Id('f0846568-2bd9-450d-95e3-9a478e20e74b'),
    } as School;
    mockRepository.findOneOrFail.mockResolvedValue(school);

    expect(
      await service.findOne('f0846568-2bd9-450d-95e3-9a478e20e74b')
    ).toEqual(school);
    expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
      where: {
        _id: {
          _id: 'f0846568-2bd9-450d-95e3-9a478e20e74b',
        },
      },
    });
  });

  it('should update a school by id', async () => {
    const updateSchoolDTO: UpdateSchoolDto = {
      name: 'ativa idade irece',
      CNPJ: '12.123.1234/0001-10',
    };
    const expectedSchool: School = new School(updateSchoolDTO);
    mockRepository.findOneOrFail.mockResolvedValue(expectedSchool);
    mockRepository.update.mockResolvedValue({ affected: 1 });

    expect(
      await service.update(
        'f0846568-2bd9-450d-95e3-9a478e20e74b',
        updateSchoolDTO
      )
    ).toEqual(expectedSchool);
    expect(mockRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    expect(mockRepository.update).toHaveBeenCalledWith(
      'f0846568-2bd9-450d-95e3-9a478e20e74b',
      expectedSchool
    );
  });

  it('should remove a school by id', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });

    await service.remove('f0846568-2bd9-450d-95e3-9a478e20e74b');
    expect(mockRepository.delete).toHaveBeenCalledWith(
      'f0846568-2bd9-450d-95e3-9a478e20e74b'
    );
  });
});
