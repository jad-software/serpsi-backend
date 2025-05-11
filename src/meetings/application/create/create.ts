import { InternalServerErrorException } from '@nestjs/common';
import { Meeting } from '../../domain/entities/meeting.entity';
import { StatusType } from '../../domain/vo/statustype.enum';
import { Repository } from 'typeorm';
import { BillsService } from '../../../bills/infra/bills.service';
import getCount from '../getCount/getCount';
import { Day } from 'src/psychologists/vo/days.enum';

export async function create(
  data: {
    meeting: Meeting,
    amount?: number,
    dueDate?: Date
  },
  service: {
    repository: Repository<Meeting>,
    billsService: BillsService,
    avaliableTimes: (psychologistId: string, startDate: Date) => Promise<any>
  },
  isMany: boolean = false) {
  const checkSchedule = await getCount(data.meeting, service.repository);
  const avaliableTimes = await service.avaliableTimes(data.meeting.psychologist.id.id, data.meeting.schedule)

  if (checkSchedule > 0 || !hasAvaliableTime(data.meeting.schedule, avaliableTimes)) {
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

function hasAvaliableTime(date: Date, avaliableDay: {
  day: Day;
  avaliableTimes: string[];
}) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;

  return avaliableDay.avaliableTimes.includes(timeString);
}