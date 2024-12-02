import { Meeting } from '../../../meetings/domain/entities/meeting.entity';
import { StatusType } from '../../../meetings/domain/vo/statustype.enum';
import { Repository } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BillsService } from 'src/bills/infra/bills.service';
import { getOneSession } from '../getOneSession/get-one-session';

export async function modifyStatus(id: string, status: StatusType, { repository, billService }: { repository: Repository<Meeting>, billService: BillsService }) {
  const session = await getOneSession(id, repository, true);
  if (status === StatusType.CREDIT || status === StatusType.CANCELED) {
    await billService.remove(session.bill.id.id);
    session.bill = null;
  }
  else if (!session.bill) {
    await billService.createWithMeeting(session, session.schedule, session.psychologist.meetValue);
  }
  session.status = status;
  session.documents = undefined;
  session.bill = undefined;
  session.psychologist = undefined;
  try {
    await repository.update(id, session);
    return session;
  }
  catch (error) {
    throw new InternalServerErrorException(
      'problemas ao atualizar o status da sessão'
    );
  }
}
