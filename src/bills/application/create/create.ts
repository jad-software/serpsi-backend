import { Bill } from "src/bills/domain/entities/bill.entity";
import { CreateBillDto } from "src/bills/infra/dto/create-bill.dto";
import { Repository } from "typeorm";

export default async function create(data: CreateBillDto, repository: Repository<Bill>): Promise<Bill>{
  return new Bill(data);
}