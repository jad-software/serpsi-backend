import { Test, TestingModule } from '@nestjs/testing';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { UpdatePaymentManyDto } from './dto/update-payment-many.dto';
import { BillType } from '../domain/vo/bill-type.enum';
import { PaymentMethod } from '../domain/vo/payment-method.vo';
import { PaymentType } from '../domain/vo/payment-type.enum';

describe('BillsController', () => {
  let controller: BillsController;
  let service: BillsService;

  const mockBillsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillsController],
      providers: [
        {
          provide: BillsService,
          useValue: mockBillsService,
        },
      ],
    }).compile();

    controller = module.get<BillsController>(BillsController);
    service = module.get<BillsService>(BillsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a bill', async () => {
      const userInfo = { id: '1' };
      const createBillDto: CreateBillDto = {
        psychologist_id: 'psychologist_id',
        amount: 100,
        dueDate: new Date(),
        title: 'title',
        billType: BillType.to_pay
      };
      const expectedResult = { id: '1', ...createBillDto };

      mockBillsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(userInfo, createBillDto);

      expect(result).toEqual(expectedResult);
      expect(createBillDto.psychologist_id).toBe(userInfo.id);
      expect(service.create).toHaveBeenCalledWith(createBillDto);
    });
  });

  describe('findAll', () => {
    it('should return all bills for logged psychologist', async () => {
      const userInfo = { id: '1' };
      const expectedResult = [{ id: '1' }, { id: '2' }];

      mockBillsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(userInfo);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(userInfo.id);
    });
  });

  describe('findOne', () => {
    it('should return a bill by id', async () => {
      const id = '1';
      const expectedResult = { id };

      mockBillsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a bill', async () => {
      const id = '1';
      const updateBillDto: UpdateBillDto = {};
      const expectedResult = { id, ...updateBillDto };

      mockBillsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateBillDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(id, updateBillDto);
    });
  });

  describe('updateMany', () => {
    it('should update payment for multiple bills', async () => {
      const updatePaymentManyDto: UpdatePaymentManyDto = {
        billIds: ['1', '2'],
        paymentMethod: new PaymentMethod({
          paymentDate: new Date(),
          paymentType: PaymentType.PIX 
        })
      };
      const expectedResult = { updated: true };

      mockBillsService.updateMany.mockResolvedValue(expectedResult);

      const result = await controller.updateMany(updatePaymentManyDto);

      expect(result).toEqual(expectedResult);
      expect(service.updateMany).toHaveBeenCalledWith(updatePaymentManyDto);
    });
  });

  describe('remove', () => {
    it('should remove a bill', async () => {
      const id = '1';
      const expectedResult = { deleted: true };

      mockBillsService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(id);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});