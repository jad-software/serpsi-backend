import { Patient } from '../../../patients/entities/patient.entity';
import { StatusType } from '../vo/statustype.enum';
import { Psychologist } from '../../../psychologists/entities/psychologist.entity';
import { Document } from '../../../documents/entities/document.entity';

export interface IMeetings {
  schedule: Date;
  status?: StatusType;
  patient: Patient | string;
  psychologist: Psychologist | string;
  documents?: Document[];
}
