
import { Meeting } from "src/meetings/domain/entities/meeting.entity";
import { StatusType } from "src/meetings/domain/vo/statustype.enum";
import { Repository } from "typeorm";

export async function getSchedule(
  psychologistId: string,
  repository: Repository<Meeting>,
  startDate: Date,
  endDate?: Date,
) {  
  if (!endDate) {
    endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 1);
  }

  return await repository
    .createQueryBuilder("meeting")
    .where("meeting.Psychologist_id = :psychologistId", { psychologistId })
    .andWhere("meeting._schedule >= :startDate", { startDate })
    .andWhere("meeting._schedule <= :endDate", { endDate })
    .leftJoinAndSelect("meeting._patient", "patient")
    .leftJoinAndSelect("patient._person", "person")
    .select([
      "meeting._id._id",
      "meeting._schedule",
      "meeting._status",
      "patient._id._id",
      "person._name",
    ])
    .orderBy("meeting._schedule", "ASC")
    .getRawMany();
} 
