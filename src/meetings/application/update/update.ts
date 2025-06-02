import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Meeting } from '../../domain/entities/meeting.entity';
import { UpdateMeetingDto } from '../../infra/dto/update-meeting.dto';
import { Repository } from 'typeorm';
import getCount from '../getCount/getCount';
import { StatusType } from '../../../meetings/domain/vo/statustype.enum';
import { BillsService } from '../../../bills/infra/bills.service';

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

    session = await service.repository.createQueryBuilder("meeting")
      .leftJoinAndSelect("meeting._bill", "bill")
      .where("meeting.id = :id", { id })
      .getOneOrFail();
    if (session.bill) await service.billsService.remove(session.bill.id.id);
    await service.billsService.createWithMeeting(updatedSession, session.schedule, updateMeetingDto.amount);
    session.bill = undefined;
    return session;
  }
  catch (error) {
    console.log(error);
    throw new InternalServerErrorException(
      'problemas ao atualizar uma sessão'
    );
  }
}
