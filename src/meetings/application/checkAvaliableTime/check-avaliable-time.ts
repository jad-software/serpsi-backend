import { Meeting } from "src/meetings/domain/entities/meeting.entity";
import { Day, numberToDay } from "src/psychologists/vo/days.enum";
import { formatTime } from "src/helpers/format-time";
import { StatusType } from "src/meetings/domain/vo/statustype.enum";

export async function checkAvaliableTime(times: { day: Day, times: string[] }[], schedule: Meeting[]) {
  schedule = schedule.filter((session) => session.status !== StatusType.CREDIT && session.status !== StatusType.CANCELED)

  const avaliableTimes = times.map((time) => {
    const day = time.day;
    const availableTimes = time.times.filter((time) => {
      const timeExists = schedule
        .find((session) => {
          const sessionTime = formatTime(session.schedule);
          return sessionTime === time;
        });
      return !timeExists;
    });
    return {
      day,
      availableTimes,
    };
  });
  return avaliableTimes;
}
