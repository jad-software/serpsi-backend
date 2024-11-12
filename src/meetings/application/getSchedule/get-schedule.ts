
import { Meeting } from "src/meetings/domain/entities/meeting.entity";
import { Repository } from "typeorm";

export async function getSchedule(
  psychologistId: string,
  repository: Repository<Meeting>,
  startDate: Date,
  endDate: Date,
) {  
  return await repository
    .createQueryBuilder("meeting")
    .where("meeting.Psychologist_id = :psychologistId", { psychologistId })
    .andWhere("meeting._schedule >= :startDate", { startDate })
    .andWhere("meeting._schedule <= :endDate", { endDate })
    .getMany();
} 
