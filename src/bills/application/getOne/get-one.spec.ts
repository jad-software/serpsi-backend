import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Bill } from '../../domain/entities/bill.entity';
import { GetOne } from './get-one';
import { NotFoundException } from '@nestjs/common';

describe('GetOne', () => {
  let repository: Repository<Bill>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: 'BillRepository',
          useClass: Repository,
        },
      ],
    }).compile();

    repository = moduleRef.get<Repository<Bill>>('BillRepository');
  });

  it('should get one bill successfully', async () => {
    const mockBill = new Bill();
    mockBill.id = '123';

    const queryBuilder = {
      where: jest.fn().mockReturnThis(),
      getOneOrFail: jest.fn().mockResolvedValue(mockBill),
    };

    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

    const result = await GetOne('123', repository);

    expect(repository.createQueryBuilder).toHaveBeenCalledWith('bill');
    expect(queryBuilder.where).toHaveBeenCalledWith('bill.id = :id', { id: '123' });
    expect(result).toBe(mockBill);
  });

  it('should throw NotFoundException when bill is not found', async () => {
    const queryBuilder = {
      where: jest.fn().mockReturnThis(),
      getOneOrFail: jest.fn().mockRejectedValue(new Error()),
    };

    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

    await expect(GetOne('nonexistent', repository)).rejects.toThrow(NotFoundException);
    await expect(GetOne('nonexistent', repository)).rejects.toThrow('conta não encontrada');
  });
});