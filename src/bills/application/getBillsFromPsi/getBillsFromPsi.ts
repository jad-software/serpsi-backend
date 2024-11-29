import { Bill } from "src/bills/domain/entities/bill.entity";
import { Repository } from "typeorm";

export async function GetBillsFromPsi(user_id: string, repository: Repository<Bill>) {
  return await repository.createQueryBuilder("bill")
    .where("bill.user_id = :user_id", { user_id })
    .orderBy("bill.dueDate", "ASC")
    .getMany();
}