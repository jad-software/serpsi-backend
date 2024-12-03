import { Meeting } from '../../domain/entities/meeting.entity';
import { StatusType } from '../../domain/vo/statustype.enum';
import { Repository } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { modifyStatus } from './modify-status';
import { Id } from '../../../entity-base/vo/id.vo';
import { BillsService } from '../../../bills/infra/bills.service';
import { getOneSession } from '../getOneSession/get-one-session';
import { Bill } from '../../../bills/domain/entities/bill.entity';

jest.mock('../getOneSession/get-one-session');

describe('modifyStatus', () => {
  let mockMeeting: Meeting;
  let mockBillsService: jest.Mocked<BillsService>;
  let mockRepository: jest.Mocked<Repository<Meeting>>;
  let mockQueryBuilder: any;

  beforeEach(() => {
    mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      getOneOrFail: jest.fn(),
    };

    mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      update: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockBillsService = {
      createWithMeeting: jest.fn(),
      remove: jest.fn()
    } as any;


    mockMeeting = new Meeting({
      bill: new Bill({ amount: 100.50 })
    });
    mockMeeting.id = new Id('123');
    mockMeeting.status = StatusType.OPEN;
  });

  it('should successfully modify meeting status', async () => {
    mockQueryBuilder.where.mockReturnThis()
    mockQueryBuilder.getOneOrFail.mockResolvedValue(mockMeeting);
    (getOneSession as jest.Mock).mockResolvedValue(mockMeeting);
    const result = await modifyStatus('123', StatusType.CONFIRMED, { repository: mockRepository, billService: mockBillsService });

    expect(result).toBeDefined();
    expect(result.status).toBe(StatusType.CONFIRMED);
    expect(getOneSession).toHaveBeenCalledWith('123', mockRepository, true);
    expect(mockRepository.update).toHaveBeenCalledWith('123', expect.any(Meeting));
  });

  it('should throw InternalServerErrorException when update fails', async () => {
    ;
    mockRepository.update.mockRejectedValue(new Error());
    (getOneSession as jest.Mock).mockResolvedValue(mockMeeting);
    // Act & Assert
    await expect(modifyStatus('123', StatusType.CONFIRMED, { repository: mockRepository, billService: mockBillsService }))
      .rejects
      .toThrow(InternalServerErrorException);
  });
});