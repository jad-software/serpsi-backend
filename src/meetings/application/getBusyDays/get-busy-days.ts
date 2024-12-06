import { Repository } from 'typeorm';
import { FindBusyDaysDAO } from './findBusyDays.dao';
import { Meeting } from '../../domain/entities/meeting.entity';
export interface visualizer {
  day: number;
  existsSession: boolean;
}
export async function getBusyDays(search: FindBusyDaysDAO, repository: Repository<Meeting>) {
  let busyDays: visualizer[] = [];
  const querybuilder =  repository.createQueryBuilder("meeting");
  for (let i = 1; i <= daysInMonth(search.month, search.year); i++) {
    let existsSession = false;
    const day = await querybuilder
      .where("meeting.Psychologist_id = :psychologistId", { psychologistId: search.psychologistId })
      .andWhere("EXTRACT(YEAR FROM meeting._schedule) = :year", { year: search.year })
      .andWhere("EXTRACT(MONTH FROM meeting._schedule) = :month", { month: search.month })
      .andWhere("EXTRACT(DAY FROM meeting._schedule) = :day", { day: i })
      .getCount();
    if (day > 0) {
      existsSession = true;
    }
    busyDays.push({ day: i, existsSession });
  }

  return busyDays;
}

function daysInMonth (month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}