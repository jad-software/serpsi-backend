import { Repository } from 'typeorm';
import { FindBusyDaysDAO } from './findBusyDays.dao';
import { Meeting } from 'src/meetings/domain/entities/meeting.entity';

export async function getBusyDays(search: FindBusyDaysDAO, repository: Repository<Meeting>) {
  return await repository.find();
}
