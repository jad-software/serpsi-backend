import { NotFoundException } from "@nestjs/common";
import { Meeting } from "src/meetings/domain/entities/meeting.entity";
import { Repository } from "typeorm";

export async function getOneSession(sessionId: string, repository: Repository<Meeting>, relations: boolean = true) {
  try {
    const querybuilder = repository.createQueryBuilder("meeting")
      .where("meeting.id = :sessionId", { sessionId })

    if (relations) {
      querybuilder.leftJoinAndSelect("meeting._documents", "documents")
        .leftJoinAndSelect("meeting._patient", "patient")
        .leftJoinAndSelect("patient._person", "patient_person")
        .leftJoinAndSelect("patient._parents", "patient_parents")
    }
    return querybuilder.getOneOrFail();
    
  } catch (error) {
    throw new NotFoundException("Sessão não encontrada");
  }

}
