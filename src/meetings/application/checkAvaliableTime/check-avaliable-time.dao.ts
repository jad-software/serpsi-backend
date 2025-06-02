import { OmitType } from "@nestjs/swagger";
import { GetScheduleDAO } from "../getSchedule/getSchedule.dao";

export class checkAvaliableTimeDAO extends OmitType(GetScheduleDAO, ['endDate'] as const) { }
