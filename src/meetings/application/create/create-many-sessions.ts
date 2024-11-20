import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Meeting } from 'src/meetings/domain/entities/meeting.entity';
import { FrequencyEnum } from 'src/meetings/infra/dto/frequency.enum';
import { Repository } from 'typeorm';
import { create } from './create';
import { formatDate } from 'src/helpers/format-date';
import { StatusType } from 'src/meetings/domain/vo/statustype.enum';

export async function createManySessions(meeting: Meeting, frequency: FrequencyEnum, quantity: number, repository: Repository<Meeting>) {
  const sessions: Meeting[] = [];
  const conflicts: string[] = [];

  for (let i = 0; i < quantity; i++) {
    const date = new Date(meeting.schedule);
    if (frequency === FrequencyEnum.MONTHLY) {
      date.setMonth(date.getMonth() + i);
    }
    else {
      date.setDate(date.getDate() + (frequency * i * 7));
    }

    const newMeeting: Meeting = new Meeting({
      ...meeting,
      schedule: date,
    })

    const session = await create(newMeeting, repository, true)

    if (session.status === StatusType.CREDIT)
      conflicts.push(`${formatDate(newMeeting.schedule)}`);
    else {
      sessions.push(session);
    }
  }
  if (sessions.length === 0) {
    throw new BadRequestException(
      'problemas ao criar sessões'
    );
  }
  return {
    sessions,
    conflicts
  }
}
