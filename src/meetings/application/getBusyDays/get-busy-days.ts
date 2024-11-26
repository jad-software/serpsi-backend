import { Repository } from 'typeorm';
import { FindBusyDaysDAO } from './findBusyDays.dao';
import { Meeting } from '../../../meetings/domain/entities/meeting.entity';
export interface visualizer {
  day: number;
  existsSession: boolean;
}
export async function getBusyDays(search: FindBusyDaysDAO, repository: Repository<Meeting>) {
  let busyDays: visualizer[] = [];
  for (let i = 1; i <= 31; i++) {
    let existsSession = false;
    const day = await repository.createQueryBuilder("meeting")
      .where("meeting.Psychologist_id = :psychologistId", { psychologistId: search.psychologistId })
      .andWhere("EXTRACT(MONTH FROM meeting._schedule) = :month", { month: search.month })
      .andWhere("EXTRACT(DAY FROM meeting._schedule) = :day", { day: i })
      .getOne();
    if (day) {
      existsSession = true;
    }
    busyDays.push({ day: i, existsSession });
  }

  return busyDays;
}

