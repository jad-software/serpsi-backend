import { InternalServerErrorException } from '@nestjs/common';
import { Meeting } from 'src/meetings/domain/entities/meeting.entity';
import { Repository } from 'typeorm';

export async function create(meeting: Meeting, repository: Repository<Meeting>) {
  try{
    return await repository.save(meeting);
  }
  catch(error){
    throw new InternalServerErrorException(
      'problemas ao criar sessão'
    );
  }
}
