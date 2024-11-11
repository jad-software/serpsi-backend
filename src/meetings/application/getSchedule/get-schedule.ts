export function getSchedule(
  startDate: Date,
  endDate: Date,
  psychologistId: string
) {
  return `get all schedules between ${startDate} and ${endDate} from ${psychologistId}`;
}
