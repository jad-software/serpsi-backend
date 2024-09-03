import { EntityBase } from '../../entity-base/entities/entity-base';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { PaymentPlan } from '../vo/PaymentPlan.enum';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { IPatient } from '../interfaces/patient.interface';
import { MedicamentInfo } from './medicamentInfo.entity';
import { School } from './school.entity';

//@Entity()
/**
 *
 * TODO [] implement school management entity
 * TODO [] implement Comorbity management entity        |
 * TODO [] implement Medicine management entity         |
 * TODO [] implement patient entity at database         V
 * TODO [] implement Person foreign keys and relations
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

  @OneToMany(() => MedicamentInfo, (medicamentInfo) => medicamentInfo.patient)
  private _medicines: MedicamentInfo[];

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
}
