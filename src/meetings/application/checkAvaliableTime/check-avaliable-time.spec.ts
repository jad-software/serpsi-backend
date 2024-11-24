
import { Meeting } from "../../../meetings/domain/entities/meeting.entity";
import { Day } from "../../../psychologists/vo/days.enum";
import { StatusType } from "../../../meetings/domain/vo/statustype.enum";
import { checkAvaliableTime } from "./check-avaliable-time";
import { Times } from "src/psychologists/interfaces/times.interface";

describe("checkAvaliableTime", () => {
  test("should return all times as available when schedule is empty", async () => {

    const times: Times = {
      meetDuration: 60,
      avaliableTimes: [{
        day: Day.SEGUNDA,
        times: ["09:00:00", "10:00:00", "11:00:00"]
      }]
    };
    const schedule: Meeting[] = [];

    const result = await checkAvaliableTime(times, schedule);

    expect(result).toEqual([{
      day: Day.SEGUNDA,
      availableTimes: ["09:00:00", "10:00:00", "11:00:00"]
    }]);
  });

  test("should ignore meetings with CREDIT or CANCELED status", async () => {
    const times: Times = {
      meetDuration: 60,
      avaliableTimes: [{
        day: Day.SEGUNDA,
        times: ["09:00:00", "10:00:00"]
      }]
    };
    const schedule: Meeting[] = [
      {
        schedule: new Date("2024-01-01T09:00:00z"),
        status: StatusType.CREDIT
      },
      {
        schedule: new Date("2024-01-01T10:00:00z"),
        status: StatusType.CANCELED
      }
    ] as Meeting[];

    const result = await checkAvaliableTime(times, schedule);

    expect(result).toEqual([{
      day: Day.SEGUNDA,
      availableTimes: ["09:00:00", "10:00:00"]
    }]);
  });

  test("should filter out occupied time slots", async () => {
    const times: Times = {
      meetDuration: 60,
      avaliableTimes: [{
        day: Day.SEGUNDA,
        times: ["09:00:00", "10:00:00", "11:00:00"]
      }]
    };
    const schedule: Meeting[] = [
      {
        schedule: new Date("2024-01-01T10:00:00z"),
        status: StatusType.CONFIRMED
      }
    ] as Meeting[];

    const result = await checkAvaliableTime(times, schedule);

    expect(result).toEqual([{
      day: Day.SEGUNDA,
      availableTimes: ["09:00:00", "11:00:00"]
    }]);
  });
});
