import { StatusType } from 'src/meetings/domain/vo/statustype.enum';

export function modifyStatus(id: string, status: StatusType) {
  return `modifying status of a meeting with this ${id} and this status ${status}`;
}
