import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IDocument } from '../interfaces/document.interface';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { EntityBase } from '../../entity-base/entities/entity-base';
import { Patient } from '../../patients/entities/patient.entity';
import { Meeting } from '../../meetings/domain/entities/meeting.entity';

@Entity()
export class Document extends EntityBase implements IDocument {
  constructor(partial: Partial<CreateDocumentDto> | Partial<Document>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ name: 'title' })
  private _title: string;

  @Column({ name: 'docLink' })
  private _docLink: string;

  @ManyToOne(() => Patient, (patient) => patient.previewFollowUps, {
    onDelete: 'CASCADE',
  })
  private _patient: Patient;

  @ManyToOne(() => Meeting, (meeting) => meeting.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Meeting_id'})
  meeting: Meeting;

  get title(): string {
    return this._title;
  }
  set title(title: string) {
    this._title = title;
  }

  get docLink(): string {
    return this._docLink;
  }
  set docLink(docLink: string) {
    this._docLink = docLink;
  }
  get patient(): Patient {
    return this._patient;
  }
  set patient(patient: Patient) {
    this._patient = patient;
  }
}
