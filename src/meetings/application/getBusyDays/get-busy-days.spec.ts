
import { Repository } from 'typeorm';
import { Meeting } from '../../../meetings/domain/entities/meeting.entity';
import { FindBusyDaysDAO } from './findBusyDays.dao';
import { getBusyDays } from './get-busy-days';

describe('getBusyDays', () => {
  let mockRepository: jest.Mocked<Repository<Meeting>>;
  let mockQueryBuilder: Partial<{
    save: jest.Mock;
    where: jest.Mock;
    andWhere: jest.Mock;
    select: jest.Mock;
    leftJoinAndSelect: jest.Mock;
    getOne: jest.Mock;
    getCount: jest.Mock;
  }> = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getCount: jest.fn(),
  };
  beforeEach(() => {
    mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getCount: jest.fn(),
    } as any;
  });

  it('should return array of busy days when meetings exist', async () => {
    mockQueryBuilder.getCount.mockResolvedValueOnce(3);

    for (let i = 0; i < 30; i++) {
      mockQueryBuilder.getCount.mockResolvedValueOnce(0);
    }

    const search: FindBusyDaysDAO = {
      psychologistId: '1',
      month: 1,
      year: 2023
    };

    const result = await getBusyDays(search, mockRepository);

    expect(result.length).toBe(31);
    expect(result[0]).toEqual({ day: 1, existsSession: true });
    expect(result[1]).toEqual({ day: 2, existsSession: false });
  });

  it('should return all days as not busy when no meetings exist', async () => {
    for (let i = 0; i < 31; i++) {
      mockQueryBuilder.getCount.mockResolvedValueOnce(0);
    }

    const search: FindBusyDaysDAO = {
      psychologistId: '1',
      month: 1,
      year: 2023
    };

    const result = await getBusyDays(search, mockRepository);

    expect(result.length).toBe(31);
    result.forEach(day => {
      expect(day.existsSession).toBe(false);
    });
  });

  it('should call repository with correct parameters', async () => {
    mockQueryBuilder.getCount.mockResolvedValue(0);

    const search: FindBusyDaysDAO = {
      psychologistId: '2',
      month: 3,
      year: 2023
    };

    await getBusyDays(search, mockRepository);

    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('meeting');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'meeting.Psychologist_id = :psychologistId',
      { psychologistId: '2' }
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'EXTRACT(MONTH FROM meeting._schedule) = :month',
      { month: 3 }
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'EXTRACT(YEAR FROM meeting._schedule) = :year',
      { year: 2023 }
    );
  });
}); 