import { InternalServerErrorException } from '@nestjs/common';
import { Meeting } from 'src/meetings/domain/entities/meeting.entity';
import { CreateMeetingDto } from 'src/meetings/infra/dto/create-meeting.dto';
import { FrequencyEnum } from 'src/meetings/infra/dto/frequency.enum';
import { Repository } from 'typeorm';

export async function createManySessions(meeting: Meeting, frequency: FrequencyEnum, quantity: number, repository: Repository<Meeting>) {
  const sessions: Meeting[] = [];
  const errors: string[] = [];
  try {
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
      //const session = await repository.save(newMeeting);
      sessions.push(newMeeting);
    }
    return sessions;
  }
  catch (error) {
    throw new InternalServerErrorException(
      'problemas nas sessões: '
    );
  }
}
