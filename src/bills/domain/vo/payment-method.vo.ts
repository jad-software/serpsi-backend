import { Column } from "typeorm";
import { PaymentType } from "./payment-type.enum";


export class PaymentMethod {
  constructor(partial: Partial<PaymentMethod>) {
    Object.assign(this, partial);
  }

  @Column({
    type: 'enum',
    name: 'paymentType',
    enum: PaymentType,
    nullable: true
  })
  private _paymentType: PaymentType;

  @Column({ name: 'paymentDate', type: "date", nullable: true })
  private _paymentDate: Date;

  get paymentDate(): Date {
    return this._paymentDate;
  }
  set paymentDate(value: Date) {
    this._paymentDate = value;
  }

  get paymentType(): PaymentType {
    return this._paymentType;
  }
  set paymentType(value: PaymentType) {
    this._paymentType = value;
  }
}