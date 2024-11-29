import { IBill } from "src/bills/domain/interfaces/bill.interface";
import { BillType } from "src/bills/domain/vo/bill-type.enum";
import { PaymentMethod } from "src/bills/domain/vo/payment-method.vo";

export class CreateBillDto implements IBill{
  amount: number;
  dueDate: Date;
  title: string;
  billType: BillType;
}
