import { Test, TestingModule } from '@nestjs/testing';
import { AgendasService } from './agendas.service';

describe('AgendasService', () => {
  let service: AgendasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgendasService],
    }).compile();

    service = module.get<AgendasService>(AgendasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
