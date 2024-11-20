import { InternalServerErrorException } from '@nestjs/common';
import { Meeting } from 'src/meetings/domain/entities/meeting.entity';
import { StatusType } from 'src/meetings/domain/vo/statustype.enum';
import { Repository } from 'typeorm';

export async function create(meeting: Meeting, repository: Repository<Meeting>, isMany: boolean = false) {
  try {
    const checkSchedule = await repository.createQueryBuilder("meeting")
      .where("meeting.schedule = :schedule", { schedule: meeting.schedule })
      .andWhere("meeting.Psychologist_id = :psychologist", { psychologist: meeting.psychologist.id.id })
      .andWhere("meeting.status != :status", { status: StatusType.CREDIT })
      .andWhere("meeting.status != :status", { status: StatusType.CANCELED })
      .getCount();

    if (checkSchedule > 0) {
      meeting.status = StatusType.CREDIT;
      if (!isMany) {
        throw new InternalServerErrorException(
          'problemas ao criar sessão'
        );
      }
    }
    return await repository.save(meeting);
  }
  catch (error) {
    throw new InternalServerErrorException(
      'problemas ao criar sessão'
    );
  }
}
