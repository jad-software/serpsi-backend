import { Test, TestingModule } from '@nestjs/testing';
import { MedicamentInfoService } from './medicament-info.service';

describe('MedicamentInfoService', () => {
  let service: MedicamentInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicamentInfoService],
    }).compile();

    service = module.get<MedicamentInfoService>(MedicamentInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
