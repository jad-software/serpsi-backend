import { Repository } from 'typeorm';
import { Meeting } from '../../domain/entities/meeting.entity';
import { StatusType } from '../../domain/vo/statustype.enum';
import { BillsService } from '../../../bills/infra/bills.service';
import { create } from './create';
import { InternalServerErrorException } from '@nestjs/common';
import * as getCount from '../getCount/getCount';

jest.mock('../getCount/getCount');

describe('create', () => {
  let mockRepository: jest.Mocked<Repository<Meeting>>;
  let mockBillsService: jest.Mocked<BillsService>;
  
  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
    } as any;

    mockBillsService = {
      createWithMeeting: jest.fn(),
    } as any;

    jest.clearAllMocks();
  });

  it('should create a meeting successfully', async () => {
    const meeting = new Meeting({});
    meeting.status = StatusType.OPEN;
    
    (getCount as unknown as jest.Mock).mockResolvedValue(0);
    mockRepository.save.mockResolvedValue(meeting);
    
    const result = await create(
      { meeting, amount: 100, dueDate: new Date() },
      { repository: mockRepository, billsService: mockBillsService },
      false
    );

    expect(result).toBe(meeting);
    expect(mockRepository.save).toHaveBeenCalledWith(meeting);
    expect(mockBillsService.createWithMeeting).toHaveBeenCalled();
  });

  it('should throw error when schedule exists and isMany is false', async () => {
    const meeting = new Meeting({});
    (getCount as unknown as jest.Mock).mockResolvedValue(1);

    await expect(
      create(
        { meeting },
        { repository: mockRepository, billsService: mockBillsService },
        false
      )
    ).rejects.toThrow(InternalServerErrorException);

    expect(meeting.status).toBe(StatusType.CREDIT);
  });

  it('should not throw error when schedule exists and isMany is true', async () => {
    const meeting = new Meeting({});
    (getCount as unknown as jest.Mock).mockResolvedValue(1);
    mockRepository.save.mockResolvedValue(meeting);

    const result = await create(
      { meeting },
      { repository: mockRepository, billsService: mockBillsService },
      true
    );

    expect(result).toBe(meeting);
    expect(meeting.status).toBe(StatusType.CREDIT);
  });

  it('should not create bill when meeting status is CREDIT', async () => {
    const meeting = new Meeting({});
    meeting.status = StatusType.CREDIT;
    
    (getCount as unknown as jest.Mock).mockResolvedValue(0);
    mockRepository.save.mockResolvedValue(meeting);

    await create(
      { meeting },
      { repository: mockRepository, billsService: mockBillsService },
      false
    );

    expect(mockBillsService.createWithMeeting).not.toHaveBeenCalled();
  });

  it('should throw error when save fails', async () => {
    const meeting = new Meeting({});
    (getCount as unknown as jest.Mock).mockResolvedValue(0);
    mockRepository.save.mockRejectedValue(new Error());

    await expect(
      create(
        { meeting },
        { repository: mockRepository, billsService: mockBillsService },
        false
      )
    ).rejects.toThrow(InternalServerErrorException);
  });
});