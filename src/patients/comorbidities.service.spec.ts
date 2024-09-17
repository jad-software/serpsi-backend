import { Test, TestingModule } from '@nestjs/testing';
import { ComorbiditiesService } from './comorbidities.service';
import { data_providers } from '../constants';
import { Repository } from 'typeorm';
import { Comorbidity } from './entities/comorbidity.entity';
import { Id } from '../entity-base/vo/id.vo';

describe('ComorbitiesService', () => {
  let service: ComorbiditiesService;
  let mockRepository: Partial<Record<keyof Repository<Comorbidity>, jest.Mock>>;
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
        ComorbiditiesService,
        {
          provide: data_providers.COMORBIDITY_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ComorbiditiesService>(ComorbiditiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve all comorbidity', async () => {
    const comorbidities: Comorbidity[] = [
      new Comorbidity({
        name: 'diabetes',
      }),
      new Comorbidity({
        name: 'autismo',
      }),
    ];
    mockRepository.find.mockResolvedValue(comorbidities);

    expect(await service.findAll()).toEqual(comorbidities);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should return a comorbidity by id', async () => {
    const comorbidity: Comorbidity = {
      id: new Id('f0846568-2bd9-450d-95e3-9a478e20e74b'),
    } as Comorbidity;
    mockRepository.findOneOrFail.mockResolvedValue(comorbidity);

    expect(
      await service.findOne('f0846568-2bd9-450d-95e3-9a478e20e74b')
    ).toEqual(comorbidity);
    expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
      where: {
        _id: {
          _id: 'f0846568-2bd9-450d-95e3-9a478e20e74b',
        },
      },
    });
  });

  it('should remove a comorbidity by id', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });

    await service.remove('f0846568-2bd9-450d-95e3-9a478e20e74b');
    expect(mockRepository.delete).toHaveBeenCalledWith(
      'f0846568-2bd9-450d-95e3-9a478e20e74b'
    );
  });
});
