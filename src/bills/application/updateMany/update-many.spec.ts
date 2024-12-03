import { Repository } from 'typeorm';
import { Bill } from '../../domain/entities/bill.entity';
import { UpdateMany } from './update-many';
import { InternalServerErrorException } from '@nestjs/common';
import { GetOne } from '../getOne/get-one';
import { PaymentMethod } from 'src/bills/domain/vo/payment-method.vo';
import { PaymentType } from 'src/bills/domain/vo/payment-type.enum';

jest.mock('../getOne/get-one');

describe('UpdateMany', () => {
  let repository: Repository<Bill>;

  beforeEach(() => {
    repository = {
      update: jest.fn(),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if no bill IDs provided', async () => {
    const updateDto = {
      billIds: [],
      paymentMethod: new PaymentMethod({
        paymentDate: new Date('2023-12-01'),
        paymentType: PaymentType.CARD
      })
    };

    await expect(UpdateMany(updateDto, repository)).rejects.toThrow(InternalServerErrorException);
  });

  it('should update multiple bills successfully', async () => {
    const mockBill = {
      id: 1,
      paymentMethod: {
        paymentDate: new Date(),
        paymentType: 'CASH'
      }
    };

    (GetOne as jest.Mock).mockResolvedValue(mockBill);

    const updateDto = {
      billIds: ['1', '2'],
      paymentMethod: new PaymentMethod({
        paymentDate: new Date('2023-12-01'),
        paymentType: PaymentType.CARD
      })
    };

    const result = await UpdateMany(updateDto, repository);

    expect(GetOne).toHaveBeenCalledTimes(2);
    expect(repository.update).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(2);
    expect(result[0].paymentMethod.paymentType).toBe('CREDIT_CARD');
  });

  it('should throw error if update fails', async () => {
    (GetOne as jest.Mock).mockRejectedValue(new Error('Database error'));

    const updateDto = {
      billIds: ['1'],
      paymentMethod: new PaymentMethod({
        paymentDate: new Date('2023-12-01'),
        paymentType: PaymentType.CARD
      })
    };

    await expect(UpdateMany(updateDto, repository)).rejects.toThrow(InternalServerErrorException);
  });
});