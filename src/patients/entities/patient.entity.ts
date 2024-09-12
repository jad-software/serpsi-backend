import { EntityBase } from '../../entity-base/entities/entity-base';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PaymentPlan } from '../vo/PaymentPlan.enum';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { IPatient } from '../interfaces/patient.interface';
import { MedicamentInfo } from './medicament-info.entity';
import { School } from './school.entity';
import { Comorbidity } from './comorbidity.entity';

@Entity()
/**
 *
 * TODO [X] implement school management entity
 * TODO [X] implement Comorbity management entity        |
 * TODO [X] implement Medicine management entity         |
 * TODO [ ] implement MedicamentInfo management          |
 * TODO [X] implement patient entity at database         V
 * TODO [ ] implement Person foreign keys and relations
 *
 */
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

  @OneToMany(() => MedicamentInfo, (medicamentInfo) => medicamentInfo.patient, {
    cascade: true,
  })
  private _medicines: MedicamentInfo[];

  @ManyToMany(() => Comorbidity)
  @JoinTable()
  private _comorbidities: Comorbidity[];

  get paymentPlan(): PaymentPlan {
    return this._paymentPlan;
  }
  set paymentPlan(paymentPlan: PaymentPlan) {
    this._paymentPlan = paymentPlan;
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
