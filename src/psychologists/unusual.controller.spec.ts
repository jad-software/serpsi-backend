import { Test, TestingModule } from '@nestjs/testing';
import { UnusualController } from './unusual.controller';
import { UnusualService } from './unusual.service';

describe('UnusualController', () => {
  let controller: UnusualController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnusualController],
      providers: [UnusualService],
    }).compile();

    controller = module.get<UnusualController>(UnusualController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
