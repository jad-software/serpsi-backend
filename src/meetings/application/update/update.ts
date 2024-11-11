import { UpdateMeetingDto } from 'src/meetings/infra/dto/update-meeting.dto';

export function update(id: string, updateMeetingDto: UpdateMeetingDto) {
  return `update a meeting with this ${id} and this object ${updateMeetingDto} `;
}
