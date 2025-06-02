import { Meeting } from "../../domain/entities/meeting.entity";
import { StatusType } from "../../domain/vo/statustype.enum";
import { Times } from "../../../psychologists/interfaces/times.interface";
import { Unusual } from "../../../psychologists/entities/unusual.entity";
import { formatTime } from "../../../helpers/format-time";

export async function checkAvaliableTime(data: { date: Date, times: Times, schedule: Meeting[], unusuals: Unusual[] }) {
  data.schedule = data.schedule.filter((session) => session.status !== StatusType.CREDIT && session.status !== StatusType.CANCELED)
  const avaliableTimes = data.times.avaliableTimes.map((slots) => {
    const day = slots.day;
    const availableTimes = slots.times.filter((time) => {
      return !areIntervalInPastTime(data.date, time)
        && !data.schedule.some(session => areIntervalsOverlappingAppointment(time, formatTime(session.schedule), data.times.meetDuration))
        && !data.unusuals.some((unusual) => areIntervalsOverlappingUnusual(time, unusual.startTime, unusual.endTime, data.times.meetDuration));
    });
    return {
      day,
      availableTimes,
    };
  });
  return avaliableTimes;
}

function areIntervalInPastTime(date: Date, slot: string) {
  const now = new Date();
  const [hour, minute, second] = slot.split(':').map(Number);

  // Cria uma nova data com a mesma data de `date` e hora local baseada em `slot`
  const slotDay = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    hour,
    minute,
    second
  );
  return now > slotDay;
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
function areIntervalsOverlappingUnusual(slot: string, startUnusual: string, endUnusual: string, meetDuration: number): boolean {
  const startInterval = new Date(`2024-01-01T${startUnusual}`);
  const endInterval = new Date(`2024-01-01T${endUnusual}`);
  const startSlot = new Date(`2024-01-01T${slot}`);
  const endSlot = new Date(startSlot.getTime() + meetDuration * 60000);

  return startSlot < endInterval && endSlot > startInterval;
}
