import { Meeting } from "src/meetings/domain/entities/meeting.entity";
import { Repository } from "typeorm";

export async function getOneSession(sessionId: string, repository: Repository<Meeting>) {
  return await repository.createQueryBuilder("meeting")
  .where("meeting.id = :sessionId", { sessionId })
  .leftJoinAndSelect("meeting._patient", "patient")
  .leftJoinAndSelect("patient._person", "patient_person")
  .leftJoinAndSelect("patient._parents", "patient_parents")
  // .leftJoinAndSelect("meeting._documents", "documents")
  .getOneOrFail();
}
