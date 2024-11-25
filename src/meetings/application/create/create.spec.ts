import { InternalServerErrorException } from '@nestjs/common';
import { Meeting } from '../../../meetings/domain/entities/meeting.entity';
import { StatusType } from '../../../meetings/domain/vo/statustype.enum';
import { create } from './create';
import { Repository } from 'typeorm';

describe('create', () => {
  let mockQueryBuilder: Partial<{
    save: jest.Mock;
    where: jest.Mock;
    andWhere: jest.Mock;
    select: jest.Mock;
    leftJoinAndSelect: jest.Mock;
    getOneOrFail: jest.Mock;
    getCount: jest.Mock;
  }> = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getOneOrFail: jest.fn(),
    getCount: jest.fn(),
  };

  const mockRepository: jest.Mocked<Partial<Repository<Meeting>>> = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    update: jest.fn(),
    delete: jest.fn(),
  };

  let meeting: Meeting;

  beforeEach(() => {
    meeting = {
      schedule: new Date(),
      psychologist: {
        id: {
          id: '123'
        }
      },
      patient: {
        id: {
          id: '456'
        }
      },
      status: StatusType.OPEN
    } as Meeting;
  });

  it('should create meeting when no schedule conflict exists', async () => {
    mockQueryBuilder.getCount.mockResolvedValue(0);
    mockRepository.save.mockResolvedValue(meeting);

    const result = await create(meeting, mockRepository as Repository<Meeting>);

    expect(result).toEqual(meeting);
    expect(mockRepository.save).toHaveBeenCalledWith(meeting);
  });

  it('should throw error when schedule conflict exists and isMany is false', async () => {
    mockQueryBuilder.getCount.mockResolvedValue(1);

    await expect(create(meeting, mockRepository  as Repository<Meeting>)).rejects.toThrow(InternalServerErrorException);
  });

  it('should create meeting with CREDIT status when schedule conflict exists and isMany is true', async () => {
    mockQueryBuilder.getCount.mockResolvedValue(1);
    const creditMeeting = meeting;
    creditMeeting.status = StatusType.CREDIT;
    mockRepository.save.mockResolvedValue(creditMeeting);
    const result = await create(meeting, mockRepository  as Repository<Meeting>, true);

    expect(result.status).toBe(StatusType.CREDIT);
    expect(mockRepository.save).toHaveBeenCalledWith(meeting);
  });

  it('should throw error when save fails', async () => {
    mockQueryBuilder.getCount.mockResolvedValue(0);
    mockRepository.save.mockRejectedValue(new Error());

    await expect(create(meeting, mockRepository  as Repository<Meeting>)).rejects.toThrow(InternalServerErrorException);
  });
});