import { CreateBillDto } from "src/bills/infra/dto/create-bill.dto";
import { EntityBase } from "../../../entity-base/entities/entity-base";
import { IBill } from "../interfaces/bill.interface";
import { Column, Entity, ManyToOne } from "typeorm";
import { BillType } from "../vo/bill-type.enum";
import { PaymentMethod } from "../vo/payment-method.vo";
import { User } from "src/users/entities/user.entity";
import { Meeting } from "src/meetings/domain/entities/meeting.entity";

@Entity()
export class Bill extends EntityBase implements IBill {
  constructor(partial: Partial<CreateBillDto | Bill>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ name: 'amount', type: "float" })
  private _amount: number;
  @Column({ name: 'dueDate', type: 'date' })
  private _dueDate: Date;
  @Column({ name: 'title' })
  private _title: string;
  @Column({
    type: 'enum',
    name: 'billType',
    enum: BillType,
    default: BillType.to_receive,
  })
  private _billType: BillType;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Meeting, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  meeting: Meeting;

  @Column(() => PaymentMethod, {
    prefix: false,
  })
  private _paymentMethod?: PaymentMethod;

  get paymentMethod(): PaymentMethod {
    return this._paymentMethod;
  }
  set paymentMethod(value: PaymentMethod) {
    this._paymentMethod = value;
  }

  get billType(): BillType {
    return this._billType;
  }
  set billType(value: BillType) {
    this._billType = value;
  }

  get title(): string {
    return this._title;
  }
  set title(value: string) {
    this._title = value;
  }

  get amount(): number {
    return this._amount;
  }
  set amount(value: number) {
    this._amount = value;
  }

  get dueDate(): Date {
    return this._dueDate;
  }
  set dueDate(value: Date) {
    this._dueDate = value;
  }
}
