import { Meeting } from "../../../meetings/domain/entities/meeting.entity";
import { formatTime } from "../../../helpers/format-time";
import { StatusType } from "../../../meetings/domain/vo/statustype.enum";
import { Times } from "../../../psychologists/interfaces/times.interface";
import { Unusual } from "src/psychologists/entities/unusual.entity";

export async function checkAvaliableTime(times: Times, schedule: Meeting[], unusuals: Unusual[]) {
  schedule = schedule.filter((session) => session.status !== StatusType.CREDIT && session.status !== StatusType.CANCELED)
  const avaliableTimes = times.avaliableTimes.map((slots) => {
    const day = slots.day;
    const availableTimes = slots.times.filter((time) => {
      return !schedule.some(session => areIntervalsOverlappingAppointment(time, formatTime(session.schedule), times.meetDuration)) 
      && !unusuals.some((unusual) => areIntervalsOverlappingUnusual(time, unusual.startTime, unusual.endTime, times.meetDuration));
    });
    return {
      day,
      availableTimes,
    };
  });
  return avaliableTimes;
}


// Function to check overlap for regular appointments
function areIntervalsOverlappingAppointment(slot: string, appointment: string, meetDuration: number): boolean {
  const startInterval = new Date(`2024-01-01T${appointment}`);
  const endInterval = new Date(startInterval.getTime() + meetDuration * 60000);
  const startSlot = new Date(`2024-01-01T${slot}`);
  const endSlot = new Date(startSlot.getTime() + meetDuration * 60000);

  return startSlot < endInterval && endSlot > startInterval;
}

// Function to check overlap for unusual time periods
function areIntervalsOverlappingUnusual(slot: string, startUnusual: string, endUnusual: string, meetDuration:number): boolean {
  const startInterval = new Date(`2024-01-01T${startUnusual}`);
  const endInterval = new Date(`2024-01-01T${endUnusual}`);
  const startSlot = new Date(`2024-01-01T${slot}`);
  const endSlot = new Date(startSlot.getTime() + meetDuration * 60000);

  return startSlot < endInterval && endSlot > startInterval;
}
