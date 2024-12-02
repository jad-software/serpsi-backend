import { InternalServerErrorException } from '@nestjs/common';
import { Meeting } from '../../../meetings/domain/entities/meeting.entity';
import { StatusType } from '../../../meetings/domain/vo/statustype.enum';
import { Repository } from 'typeorm';
import { BillsService } from 'src/bills/infra/bills.service';
import getCount from '../getCount/getCount';

export async function create(data: { meeting: Meeting, amount?: number, dueDate?: Date }, service: { repository: Repository<Meeting>, billsService: BillsService }, isMany: boolean = false) {
  const checkSchedule = await getCount(data.meeting, service.repository);

  if (checkSchedule > 0) {
    data.meeting.status = StatusType.CREDIT;
    if (!isMany) {
      throw new InternalServerErrorException(
        'problemas ao criar sessão'
      );
    }
  }

  try {
    const meeting = await service.repository.save(data.meeting);
    if (data.meeting.status !== StatusType.CREDIT) {
      await service.billsService.createWithMeeting(meeting, data.dueDate, data.amount);
    }
    return meeting;
  }
  catch (error) {
    throw new InternalServerErrorException(
      'problemas ao criar sessão'
    );
  }
}
