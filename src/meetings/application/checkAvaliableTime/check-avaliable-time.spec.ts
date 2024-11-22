
import { Meeting } from "../../../meetings/domain/entities/meeting.entity";
import { Day } from "../../../psychologists/vo/days.enum";
import { StatusType } from "../../../meetings/domain/vo/statustype.enum";
import { checkAvaliableTime } from "./check-avaliable-time";

describe("checkAvaliableTime", () => {
  test("should return all times as available when schedule is empty", async () => {
    const times = [{
      day: Day.SEGUNDA,
      times: ["09:00:00", "10:00:00", "11:00:00"]
    }];
    const schedule: Meeting[] = [];

    const result = await checkAvaliableTime(times, schedule);

    expect(result).toEqual([{
      day: Day.SEGUNDA,
      availableTimes: ["09:00:00", "10:00:00", "11:00:00"]
    }]);
  });

  test("should ignore meetings with CREDIT or CANCELED status", async () => {
    const times = [{
      day: Day.SEGUNDA,
      times: ["09:00:00", "10:00:00"]
    }];
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
    const times = [{
      day: Day.SEGUNDA,
      times: ["09:00:00", "10:00:00", "11:00:00"]
    }];
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

  test("should handle multiple days correctly", async () => {
    const times = [
      {
        day: Day.SEGUNDA,
        times: ["09:00:00", "10:00:00"]
      },
      {
        day: Day.TERCA,
        times: ["14:00:00", "15:00:00"]
      }
    ];
    const schedule: Meeting[] = [
      {
        schedule: new Date("2024-01-01T09:00:00z"),
        status: StatusType.CONFIRMED
      },
      {
        schedule: new Date("2024-01-02T15:00:00z"),
        status: StatusType.OPEN
      }
    ] as Meeting[];

    const result = await checkAvaliableTime(times, schedule);

    expect(result).toEqual([
      {
        day: Day.SEGUNDA,
        availableTimes: ["10:00:00"]
      },
      {
        day: Day.TERCA,
        availableTimes: ["14:00:00"]
      }
    ]);
  });
});
