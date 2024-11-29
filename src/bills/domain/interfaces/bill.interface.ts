import { BillType } from "../vo/bill-type.enum";

export interface IBill {
  amount: number;
  dueDate: Date;
  title: string;
  billType: BillType;
}