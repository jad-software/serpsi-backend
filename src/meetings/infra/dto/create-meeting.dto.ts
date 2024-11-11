import { CreateDocumentDto } from 'src/documents/dto/create-document.dto';
import { IMeetings } from 'src/meetings/domain/intefaces/meetings.interface';
import { StatusType } from 'src/meetings/domain/vo/statustype.enum';

export class CreateMeetingDto implements IMeetings {
  schedule: Date;
  status: StatusType;
  patient: string;
  psychologist: string;
  documents: CreateDocumentDto[];
}
