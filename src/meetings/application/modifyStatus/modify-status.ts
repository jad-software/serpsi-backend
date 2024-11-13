import { Meeting } from 'src/meetings/domain/entities/meeting.entity';
import { StatusType } from 'src/meetings/domain/vo/statustype.enum';
import { Repository } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

export async function modifyStatus(id: string, status: StatusType, repository: Repository<Meeting>) {
  try {
    const session = await repository.createQueryBuilder("meeting")
      .where("meeting.id = :id", { id })
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException('sessão não encontrada')
      });

    session.status = status;
    await repository.update(id, session);
    return session;
  }
  catch (error) {
    throw new InternalServerErrorException(
      'problemas ao atualizar o status da sessão'
    );
  }
}
