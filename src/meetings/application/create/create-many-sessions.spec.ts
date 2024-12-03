import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Meeting } from '../../domain/entities/meeting.entity';
import { FrequencyEnum } from '../../infra/dto/frequency.enum';
import { Repository } from 'typeorm';
import { StatusType } from '../../domain/vo/statustype.enum';
import { createManySessions } from './create-many-sessions';
import { Id } from '../../../entity-base/vo/id.vo';
import { Psychologist } from '../../../psychologists/entities/psychologist.entity';
import { Patient } from '../../../patients/entities/patient.entity';

describe('createManySessions', () => {
  let mockMeeting: Meeting;

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

  beforeEach(() => {

    mockMeeting = new Meeting({
      schedule: new Date('2024-01-01'),
      psychologist: new Psychologist({ id: new Id('1') }),
      patient: new Patient({ id: new Id('2') }),
      frequency: FrequencyEnum.WEEKLY,
      status: StatusType.OPEN,
    });
  });

  it('should create multiple sessions successfully for weekly frequency', async () => {
    mockQueryBuilder.getCount.mockResolvedValue(0);
    mockRepository.save.mockResolvedValue(mockMeeting);

    const result = await createManySessions(mockMeeting, FrequencyEnum.WEEKLY, 3, mockRepository as any);

    expect(result.sessions.length).toBe(3);
    expect(result.conflicts.length).toBe(0);
    expect(result.sessions[0].status).toBe(StatusType.OPEN);
    expect(result.sessions[1].status).toBe(StatusType.OPEN);
    expect(result.sessions[2].status).toBe(StatusType.OPEN);
  });
  it('should create multiple sessions successfully for monthly frequency', async () => {
    mockQueryBuilder.getCount.mockResolvedValue(0);
    mockRepository.save.mockResolvedValueOnce(mockMeeting);
    mockRepository.save.mockResolvedValueOnce(new Meeting({ ...mockMeeting, status: StatusType.OPEN }));

    const result = await createManySessions(mockMeeting, FrequencyEnum.MONTHLY, 2, mockRepository as any);

    expect(result.sessions.length).toBe(2);
    expect(result.conflicts.length).toBe(0);
  });

  it('should handle conflicts and return them in the result', async () => {
    mockQueryBuilder.getCount.mockResolvedValueOnce(0);
    mockQueryBuilder.getCount.mockResolvedValueOnce(1);
    mockQueryBuilder.getCount.mockResolvedValueOnce(1);
    mockRepository.save.mockResolvedValueOnce(mockMeeting);
    mockRepository.save.mockResolvedValueOnce(new Meeting({ ...mockMeeting, status: StatusType.CREDIT }));
    mockRepository.save.mockResolvedValueOnce(new Meeting({ ...mockMeeting, status: StatusType.CREDIT }));

    const result = await createManySessions(mockMeeting, FrequencyEnum.WEEKLY, 3, mockRepository as any);

    expect(result.sessions.length).toBe(1);
    expect(result.conflicts.length).toBe(2);
  });

  it('should throw a badRequestException when all sessions has conflict', async () => {
    mockQueryBuilder.getCount.mockResolvedValueOnce(1);
    mockQueryBuilder.getCount.mockResolvedValueOnce(1);
    mockRepository.save.mockResolvedValueOnce(new Meeting({ ...mockMeeting, status: StatusType.CREDIT }));
    mockRepository.save.mockResolvedValueOnce(new Meeting({ ...mockMeeting, status: StatusType.CREDIT }));

    await expect(createManySessions(mockMeeting, FrequencyEnum.WEEKLY, 2, mockRepository as any))
      .rejects
      .toThrow(BadRequestException);

  });

  it('should throw BadRequestException when no sessions can be created', async () => {
    mockRepository.save.mockRejectedValue(BadRequestException)

    await expect(createManySessions(mockMeeting, FrequencyEnum.WEEKLY, 1, mockRepository as any))
      .rejects
      .toThrow(InternalServerErrorException);
  });
});
