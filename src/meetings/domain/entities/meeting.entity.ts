import { EntityBase } from 'src/entity-base/entities/entity-base';
import { IMeetings } from '../intefaces/meetings.interface';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { Psychologist } from 'src/psychologists/entities/psychologist.entity';
import { StatusType } from '../vo/statustype.enum';
import { Document } from 'src/documents/entities/document.entity';
import { CreateMeetingDto } from 'src/meetings/infra/dto/create-meeting.dto';

@Entity()
export class Meeting extends EntityBase implements IMeetings {
  constructor(partial: Partial<CreateMeetingDto> | Partial<Meeting>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ name: 'schedule', type: 'timestamptz', })
  private _schedule: Date;

  @Column({
    type: 'enum',
    name: 'status',
    enum: StatusType,
    default: StatusType.OPEN,
  })
  private _status: StatusType;

  @ManyToOne(() => Patient, (patient) => patient.meetings, {
    onDelete: 'CASCADE',
  })
  protected _patient: Patient;

  @ManyToOne(() => Psychologist, (psychologist) => psychologist.meetings, {
    onDelete: 'CASCADE',
  })
  protected _psychologist: Psychologist;

  @OneToMany(() => Document, (document) => document.meeting)
  protected _documents: Document[];

  get schedule(): Date {
    return this._schedule;
  }
  set schedule(value: Date) {
    this._schedule = value;
  }
  get status(): StatusType {
    return this._status;
  }
  set status(value: StatusType) {
    this._status = value;
  }
  get patient(): Patient {
    return this._patient;
  }
  set patient(value: Patient) {
    this._patient = value;
  }
  get psychologist(): Psychologist {
    return this._psychologist;
  }
  set psychologist(value: Psychologist) {
    this._psychologist = value;
  }
  get documents(): Document[] {
    return this._documents;
  }
  set documents(value: Document[]) {
    this._documents = value;
  }
}
