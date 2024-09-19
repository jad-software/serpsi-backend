import { EntityBase } from '../../entity-base/entities/entity-base';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { PaymentPlan } from '../vo/PaymentPlan.enum';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { IPatient } from '../interfaces/patient.interface';
import { MedicamentInfo } from './medicament-info.entity';
import { School } from './school.entity';
import { Comorbidity } from './comorbidity.entity';
import { Person } from '../../persons/entities/person.enitiy';
import { Document } from '../../documents/entities/document.entity';

@Entity()
export class Patient extends EntityBase implements IPatient {
  constructor(partial: Partial<CreatePatientDto>) {
    super();
    Object.assign(this, partial);
  }
  @Column({
    type: 'enum',
    name: 'payment_plan',
    enum: PaymentPlan,
    default: PaymentPlan.MENSAL,
  })
  private _paymentPlan: PaymentPlan;

  @ManyToOne(() => School)
  private _school: School;

  @OneToMany(() => MedicamentInfo, (medicamentInfo) => medicamentInfo.patient)
  private _medicines: MedicamentInfo[];

  @ManyToMany(() => Comorbidity)
  @JoinTable()
  private _comorbidities: Comorbidity[];

  @OneToMany(() => Document, (document) => document, {
    nullable: true,
  })
  private _previewFollowUps?: Document[];

  @OneToOne(() => Person, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  private _person: Person;

  get previewFollowUps(): Document[] {
    return this._previewFollowUps;
  }

  set previewFollowUps(previewFollowUps: Document[]) {
    this._previewFollowUps = previewFollowUps;
  }

  get paymentPlan(): PaymentPlan {
    return this._paymentPlan;
  }
  set paymentPlan(paymentPlan: PaymentPlan) {
    this._paymentPlan = paymentPlan;
  }

  get person(): Person {
    return this._person;
  }

  set person(person: Person) {
    this._person = person;
  }

  get medicines(): MedicamentInfo[] {
    return this._medicines;
  }

  set medicines(medicines: MedicamentInfo[]) {
    this._medicines = medicines;
  }

  get school(): School {
    return this._school;
  }

  set school(school: School) {
    this._school = school;
  }

  get comorbidities(): Comorbidity[] {
    return this._comorbidities;
  }

  set comorbidities(comorbidities: Comorbidity[]) {
    this._comorbidities = comorbidities;
  }
}
