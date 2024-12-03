import { Meeting } from '../../domain/entities/meeting.entity';
import { StatusType } from '../../domain/vo/statustype.enum';
import { Repository } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { modifyStatus } from './modify-status';
import { Id } from '../../../entity-base/vo/id.vo';

describe('modifyStatus', () => {
  let mockMeeting: Meeting;

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

    mockMeeting = new Meeting({});
    mockMeeting.id = new Id('123');
    mockMeeting.status = StatusType.OPEN;
  });

  it('should successfully modify meeting status', async () => {
    mockQueryBuilder.where.mockReturnThis()
    mockQueryBuilder.getOneOrFail.mockResolvedValue(mockMeeting);

    const result = await modifyStatus('123', StatusType.CONFIRMED, mockRepository);

    expect(result).toBeDefined();
    expect(result.status).toBe(StatusType.CONFIRMED);
    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('meeting');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('meeting.id = :id', { id: '123' });
    expect(mockRepository.update).toHaveBeenCalledWith('123', expect.any(Meeting));
  });

  it('should throw InternalServerErrorException when update fails', async () => {
    ;
    mockRepository.update.mockRejectedValue(new Error());

    // Act & Assert
    await expect(modifyStatus('123', StatusType.CONFIRMED, mockRepository))
      .rejects
      .toThrow(InternalServerErrorException);
  });
});