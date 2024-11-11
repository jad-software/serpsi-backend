import { Patient } from "src/patients/entities/patient.entity";
import { StatusType } from "../vo/statustype.enum";
import { Psychologist } from "src/psychologists/entities/psychologist.entity";
import { Document } from "src/documents/entities/document.entity";
import { CreateDocumentDto } from "src/documents/dto/create-document.dto";

export interface IMeetings {
  schedule: Date,
  status: StatusType,
  patient: Patient | string,
  psychologist: Psychologist | string,
  documents: Document[] | CreateDocumentDto[]
}