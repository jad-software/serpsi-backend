import { FindBusyDaysDAO } from './findBusyDays.dao';

export function getBusyDays(search: FindBusyDaysDAO) {
  return `get all busy days in the month ${search.month} from ${search.psychologistId}`;
}
