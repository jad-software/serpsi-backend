import { Day } from "../vo/days.enum"

export interface Times {
  meetDuration: number,
  avaliableTimes: AvaliableTimeType[]
}

export type AvaliableTimeType = {
  day: Day,
  times: string[]
}