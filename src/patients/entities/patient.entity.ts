import { EntityBase } from '../../entity-base/entities/entity-base';
import { Column, Entity } from 'typeorm';
import { PaymentPlan } from '../vo/PaymentPlan.enum';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { IPatient } from '../interfaces/patient.interface';

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

  get paymentPlan(): PaymentPlan {
    return this._paymentPlan;
  }
  set paymentPlan(paymentPlan: PaymentPlan) {
    this._paymentPlan = paymentPlan;
  }
}
