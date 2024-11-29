import { Bill } from "src/bills/domain/entities/bill.entity";
import { PaymentMethod } from "src/bills/domain/vo/payment-method.vo";
import { PaymentType } from "src/bills/domain/vo/payment-type.enum";

export class UpdatePaymentManyDto {
  bills: Partial<Bill>[];
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
}
