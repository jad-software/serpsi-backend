
import { Meeting } from "../../domain/entities/meeting.entity";
import { Day } from "../../../psychologists/vo/days.enum";
import { StatusType } from "../../domain/vo/statustype.enum";
import { checkAvaliableTime } from "./check-avaliable-time";
import { Times } from "../../../psychologists/interfaces/times.interface";
import { Unusual } from "../../../psychologists/entities/unusual.entity";

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
    const unusuals: Unusual[] = []

    const result = await checkAvaliableTime(times, schedule, unusuals);

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
    const unusuals: Unusual[] = []

    const result = await checkAvaliableTime(times, schedule, unusuals);

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
    const unusuals: Unusual[] = []

    const result = await checkAvaliableTime(times, schedule, unusuals);

    expect(result).toEqual([{
      day: Day.SEGUNDA,
      availableTimes: ["09:00:00", "11:00:00"]
    }]);
  });

  test("should filter out occupied time slots with a appointment out of order", async () => {
    const times: Times = {
      meetDuration: 60,
      avaliableTimes: [{
        day: Day.SEGUNDA,
        times: ["09:00:00", "10:00:00", "11:00:00", "12:00:00"]
      }]
    };
    const schedule: Meeting[] = [
      {
        schedule: new Date("2024-01-01T10:20:00z"),
        status: StatusType.CONFIRMED
      }
    ] as Meeting[];
    const unusuals: Unusual[] = []
    const result = await checkAvaliableTime(times, schedule, unusuals);

    expect(result).toEqual([{
      day: Day.SEGUNDA,
      availableTimes: ["09:00:00", "12:00:00"]
    }]);
  });

  test("should filter out occupied time slots with unusual time", async () => {
    const times: Times = {
      meetDuration: 60,
      avaliableTimes: [{
        day: Day.SEGUNDA,
        times: ["09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00"]
      }]
    };
    const schedule: Meeting[] = [
      {
        schedule: new Date("2024-01-01T10:00:00z"),
        status: StatusType.CONFIRMED
      }
    ] as Meeting[];
    const unusuals: Unusual[] = [
      new Unusual({
        date: new Date("2024-01-01T11:00:00z"),
        startTime: "11:00:00",
        endTime: "12:00:00",
      })
    ]

    const result = await checkAvaliableTime(times, schedule, unusuals);

    expect(result).toEqual([{
      day: Day.SEGUNDA,
      availableTimes: ["09:00:00", "12:00:00", "13:00:00"]
    }]);
  });
});
