import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Meeting } from '../../domain/entities/meeting.entity';
import { UpdateMeetingDto } from '../../infra/dto/update-meeting.dto';
import { Repository } from 'typeorm';
import getCount from '../getCount/getCount';
import { StatusType } from 'src/meetings/domain/vo/statustype.enum';
import { BillsService } from 'src/bills/infra/bills.service';

export async function update(id: string, updateMeetingDto: UpdateMeetingDto, service: { repository: Repository<Meeting>, billsService: BillsService }) {
  let session = await service.repository.createQueryBuilder("meeting")
    .where("meeting.id = :id", { id })
    .leftJoinAndSelect("meeting._patient", "patient")
    .leftJoinAndSelect("patient._person", "person")
    .leftJoinAndSelect("meeting._psychologist", "psychologist")
    .getOneOrFail().catch(() => { throw new NotFoundException("Sessão não encontrada") });
  let updatedSession = new Meeting({ ...session, schedule: updateMeetingDto.schedule });
  const checkSchedule = await getCount(updatedSession, service.repository);

  if (checkSchedule > 0) {
    throw new InternalServerErrorException(
      'Horário indisponível'
    );
  }
  try {
    updatedSession.status = StatusType.OPEN;
    await service.repository.update(id, updatedSession);
    await service.billsService.createWithMeeting(updatedSession, null, updateMeetingDto.amount);

    session = await service.repository.createQueryBuilder("meeting")
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
