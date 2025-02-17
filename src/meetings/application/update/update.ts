import { InternalServerErrorException } from '@nestjs/common';
import { Meeting } from '../../domain/entities/meeting.entity';
import { UpdateMeetingDto } from '../../infra/dto/update-meeting.dto';
import { Repository } from 'typeorm';

export async function update(id: string, updateMeetingDto: UpdateMeetingDto, repository: Repository<Meeting>) {
  try {
    let session = await repository.createQueryBuilder("meeting")
      .where("meeting.id = :id", { id })
      .getOneOrFail();
    let updatedSession = new Meeting(updateMeetingDto);
    await repository.update(id, updatedSession);
    session = await repository.createQueryBuilder("meeting")
      .where("meeting.id = :id", { id })
      .getOneOrFail();
    return session;
  }
  catch (error) {
    throw new InternalServerErrorException(
      'problemas ao atualizar uma sessão'
    );
  }
}
