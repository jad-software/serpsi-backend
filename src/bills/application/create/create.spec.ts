import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import create from './create';
import { Bill } from '../../domain/entities/bill.entity';
import { BillType } from '../../domain/vo/bill-type.enum';
import { Id } from '../../../entity-base/vo/id.vo';

describe('create', () => {
  let repository: Repository<Bill>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
    } as any;
  });

  it('should create and save a new bill successfully', async () => {
    // Arrange
    const billData = new Bill({
      amount: 100,
      dueDate: new Date(),
      title: 'Test Bill',
      billType: BillType.to_pay,
    });
    const createdBill = new Bill(billData)
    createdBill.id = new Id("1")
    jest.spyOn(repository, 'create').mockReturnValue(createdBill);
    jest.spyOn(repository, 'save').mockResolvedValue(createdBill);

    // Act
    const result = await create(billData, repository);

    // Assert
    expect(repository.create).toHaveBeenCalledWith(billData);
    expect(repository.save).toHaveBeenCalledWith(createdBill);
    expect(result).toEqual(createdBill);
  });

  it('should throw InternalServerErrorException when repository throws error', async () => {
    // Arrange
    const billData = new Bill({
      amount: 100,
      dueDate: new Date(),
      title: 'Test Bill',
      billType: BillType.to_pay,
    });

    jest.spyOn(repository, 'create').mockImplementation(() => {
      throw new Error();
    });

    // Act & Assert
    await expect(create(billData, repository)).rejects.toThrow(
      new InternalServerErrorException('Erro ao criar conta')
    );
  });
});