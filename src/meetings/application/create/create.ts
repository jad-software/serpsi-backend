import { CreateMeetingDto } from 'src/meetings/infra/dto/create-meeting.dto';

export function create(meeting: CreateMeetingDto) {
  return `a new meeting with this object ${meeting} will be created`;
}
