
import { Repository } from 'typeorm';
import { Bill } from '../../domain/entities/bill.entity';
import { UpdateBillDto } from '../../infra/dto/update-bill.dto';
import { Update } from './update';
import { GetOne } from '../getOne/get-one';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('../getOne/get-one');

describe('Update', () => {
  let repository: Repository<Bill>;
  
  beforeEach(() => {
    repository = {
      update: jest.fn(),
    } as any;
    
    (GetOne as jest.Mock).mockClear();
  });

  it('should update a bill successfully', async () => {
    // Arrange
    const id = '123';
    const updateBillDto: UpdateBillDto = {
      title: 'Updated Bill',
      amount: 100
    };
    const existingBill = new Bill({ title: 'Old Bill', amount: 50 });
    const updatedBill = new Bill(updateBillDto);
    
    (GetOne as jest.Mock)
      .mockResolvedValueOnce(existingBill)
      .mockResolvedValueOnce(updatedBill);
    
    repository.update = jest.fn().mockResolvedValue(undefined);

    // Act
    const result = await Update(id, updateBillDto, repository);

    // Assert
    expect(GetOne).toHaveBeenCalledTimes(2);
    expect(repository.update).toHaveBeenCalledWith(id, expect.any(Bill));
    expect(result).toEqual(updatedBill);
  });

  it('should throw InternalServerErrorException when update fails', async () => {
    // Arrange
    const id = '123';
    const updateBillDto: UpdateBillDto = {
      title: 'Updated Bill',
      amount: 100
    };
    const existingBill = new Bill({ title: 'Old Bill', amount: 50 });
    
    (GetOne as jest.Mock).mockResolvedValueOnce(existingBill);
    repository.update = jest.fn().mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(Update(id, updateBillDto, repository))
      .rejects
      .toThrow(InternalServerErrorException);
    
    expect(GetOne).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(id, expect.any(Bill));
  });

  it('should throw error if bill not found', async () => {
    // Arrange
    const id = 'non-existent';
    const updateBillDto: UpdateBillDto = {
      title: 'Updated Bill',
      amount: 100
    };
    
    (GetOne as jest.Mock).mockRejectedValue(new Error('Bill not found'));

    // Act & Assert
    await expect(Update(id, updateBillDto, repository))
      .rejects
      .toThrow('Bill not found');
    
    expect(GetOne).toHaveBeenCalledTimes(1);
    expect(repository.update).not.toHaveBeenCalled();
  });
});