import { Meeting } from "src/meetings/domain/entities/meeting.entity";
import { StatusType } from "src/meetings/domain/vo/statustype.enum";
import { Repository } from "typeorm";

export default async function getCount(meeting: Meeting, repository: Repository<Meeting>) {
  return await repository.createQueryBuilder("meeting")
    .where("meeting.schedule = :schedule", { schedule: meeting.schedule })
    .andWhere("meeting.Psychologist_id = :psychologist", { psychologist: meeting.psychologist.id.id })
    .andWhere("meeting.status != :status", { status: StatusType.CREDIT })
    .andWhere("meeting.status != :status", { status: StatusType.CANCELED })
    .getCount();
}