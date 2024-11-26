import { Meeting } from "../../../meetings/domain/entities/meeting.entity";
import { formatTime } from "../../../helpers/format-time";
import { StatusType } from "../../../meetings/domain/vo/statustype.enum";
import { Times } from "src/psychologists/interfaces/times.interface";

export async function checkAvaliableTime(times: Times, schedule: Meeting[]) {
  schedule = schedule.filter((session) => session.status !== StatusType.CREDIT && session.status !== StatusType.CANCELED)

  const avaliableTimes = times.avaliableTimes.map((slots) => {
    const day = slots.day;
    const availableTimes = slots.times.filter((time) => {
      return !schedule.some(session => areIntervalsOverlapping(time, formatTime(session.schedule), times.meetDuration));
    });
    return {
      day,
      availableTimes,
    };
  });
  return avaliableTimes;
}


function areIntervalsOverlapping(slot: string, appointment: string, meetDuration: number): boolean {
  const startInterval = new Date(`2024-01-01T${appointment}`);
  const endInterval = new Date(startInterval.getTime() + meetDuration * 60000);
  const startSlot = new Date(`2024-01-01T${slot}`);
  const endSlot = new Date(startSlot.getTime() + meetDuration * 60000);

  return startSlot < endInterval && endSlot > startInterval;
}