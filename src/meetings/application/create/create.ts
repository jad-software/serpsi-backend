import { InternalServerErrorException } from '@nestjs/common';
import { Meeting } from '../../../meetings/domain/entities/meeting.entity';
import { StatusType } from '../../../meetings/domain/vo/statustype.enum';
import { Repository } from 'typeorm';
import { BillsService } from 'src/bills/infra/bills.service';
import getCount from '../getCount/getCount';

export async function create(data: { meeting: Meeting, amount?: number, dueDate?: Date }, service: { repository: Repository<Meeting>, billsService: BillsService }, isMany: boolean = false) {
  try {
    const checkSchedule = await getCount(data.meeting, service.repository);

    if (checkSchedule > 0) {
      data.meeting.status = StatusType.CREDIT;
      if (!isMany) {
        throw new InternalServerErrorException(
          'problemas ao criar sessão'
        );
      }
    }
    if (data.meeting.status !== StatusType.CREDIT) {
      await service.billsService.createWithMeeting(data.meeting, data.dueDate, data.amount);
    }
    return await service.repository.save(data.meeting);
  }
  catch (error) {
    throw new InternalServerErrorException(
      'problemas ao criar sessão'
    );
  }
}
