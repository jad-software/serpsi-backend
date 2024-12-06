import { NotFoundException } from "@nestjs/common";
import { Meeting } from "../../domain/entities/meeting.entity";
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
        .leftJoinAndSelect("meeting._psychologist", "psychologist")
        .leftJoinAndSelect("meeting._bill", "bill")
    }
    return await querybuilder.getOneOrFail();

  } catch (error) {
    throw new NotFoundException("Sessão não encontrada");
  }
}
