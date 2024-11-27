import { Test, TestingModule } from '@nestjs/testing';
import { UnusualService } from './unusual.service';

describe('UnusualService', () => {
  let service: UnusualService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnusualService],
    }).compile();

    service = module.get<UnusualService>(UnusualService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
