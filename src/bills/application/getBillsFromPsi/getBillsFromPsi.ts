import { Bill } from "src/bills/domain/entities/bill.entity";
import { Repository } from "typeorm";

export async function GetBillsFromPsi(psychologist_id: string, repository: Repository<Bill>) {
  return await repository.createQueryBuilder("bill")
    .where("bill.psychologist_id = :psychologist_id", { psychologist_id })
    .getMany();
}