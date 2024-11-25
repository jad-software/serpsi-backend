import { Meeting } from "src/meetings/domain/entities/meeting.entity";
import { Repository } from "typeorm";

export async function remove(id: string, repository: Repository<Meeting>) {
  return await repository.delete(id);
}
