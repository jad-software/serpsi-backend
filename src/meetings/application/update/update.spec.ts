import { Repository } from 'typeorm';
import { Meeting } from '../../../meetings/domain/entities/meeting.entity';
import { UpdateMeetingDto } from '../../../meetings/infra/dto/update-meeting.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { update } from './update';
import { Id } from '../../../entity-base/vo/id.vo';

describe('update', () => {
  let mockRepository: jest.Mocked<Repository<Meeting>>;
  let mockMeeting: Meeting;
  let mockUpdateDto: UpdateMeetingDto;

  beforeEach(() => {
    mockRepository = {
      createQueryBuilder: jest.fn(),
      update: jest.fn(),
    } as any;

    mockMeeting = new Meeting({
      id: new Id('123'),
      schedule: new Date('2024-11-22T08:00:00z'),
      patient: "",
      psychologist: ""
    });

    mockUpdateDto = {
      schedule: new Date('2024-11-23T09:00:00z'),
    };
  });

  it('should successfully update a meeting', async () => {
    const queryBuilder = {
      where: jest.fn().mockReturnThis(),
      getOneOrFail: jest.fn().mockResolvedValueOnce(mockMeeting)
        .mockResolvedValueOnce({ ...mockMeeting, ...mockUpdateDto })
    };

    mockRepository.createQueryBuilder.mockReturnValue(queryBuilder as any);
    mockRepository.update.mockResolvedValue(undefined);

    const result = await update('123', mockUpdateDto, mockRepository);

    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('meeting');
    expect(queryBuilder.where).toHaveBeenCalledWith('meeting.id = :id', { id: '123' });
    expect(mockRepository.update).toHaveBeenCalledWith('123', expect.any(Meeting));
    expect(result).toEqual({ ...mockMeeting, ...mockUpdateDto });
  });

  it('should throw InternalServerErrorException when meeting is not found', async () => {
    const queryBuilder = {
      where: jest.fn().mockReturnThis(),
      getOneOrFail: jest.fn().mockRejectedValue(new Error('Meeting not found'))
    };

    mockRepository.createQueryBuilder.mockReturnValue(queryBuilder as any);

    await expect(update('123', mockUpdateDto, mockRepository))
      .rejects
      .toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException when update fails', async () => {
    const queryBuilder = {
      where: jest.fn().mockReturnThis(),
      getOneOrFail: jest.fn().mockResolvedValue(mockMeeting)
    };

    mockRepository.createQueryBuilder.mockReturnValue(queryBuilder as any);
    mockRepository.update.mockRejectedValue(new Error('Update failed'));

    await expect(update('123', mockUpdateDto, mockRepository))
      .rejects
      .toThrow(InternalServerErrorException);
  });
});