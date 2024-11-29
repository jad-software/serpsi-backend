import { Bill } from "src/bills/domain/entities/bill.entity";
import { Repository } from "typeorm";

export async function Delete(id: string, repository: Repository<Bill>) {
  return await repository.delete(id);
}