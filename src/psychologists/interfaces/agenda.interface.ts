import { Day } from '../vo/days.enum';

export interface IAgenda {
  day: Day;
  startTime: string;
  endTime: string;
}
