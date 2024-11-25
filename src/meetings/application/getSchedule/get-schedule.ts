
import { Meeting } from "src/meetings/domain/entities/meeting.entity";
import { Repository } from "typeorm";

export type getScheduleProps = {
  psychologistId: string;
  startDate: Date;
  endDate?: Date;
  isEntity?: boolean;
}

export async function getSchedule(
  { psychologistId,
    startDate,
    endDate,
    isEntity = false }: getScheduleProps,
  repository: Repository<Meeting>,
) {
  if (!endDate) {
    endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 1);
  }
  const queryBuilder = repository
    .createQueryBuilder("meeting")
    .where("meeting.Psychologist_id = :psychologistId", { psychologistId })
    .andWhere("meeting._schedule >= :startDate", { startDate })
    .andWhere("meeting._schedule <= :endDate", { endDate })
    .leftJoinAndSelect("meeting._patient", "patient")
    .leftJoinAndSelect("patient._person", "person");

  if (isEntity) {
    return await queryBuilder.getMany();
  }

  return await queryBuilder.select([
    "meeting._id._id",
    "meeting._schedule",
    "meeting._status",
    "patient._id._id",
    "person._name",
  ])
    .orderBy("meeting._schedule", "ASC")
    .getRawMany();
} 
