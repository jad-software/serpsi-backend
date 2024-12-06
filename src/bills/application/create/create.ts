import { InternalServerErrorException } from "@nestjs/common";
import { Bill } from "../../domain/entities/bill.entity";
import { Repository } from "typeorm";

export default async function create(data: Bill, repository: Repository<Bill>): Promise<Bill> {
  try {
    const newBill = repository.create(data);
    await repository.save(newBill);
    return newBill;
  }
  catch (error) {
    throw new InternalServerErrorException('Erro ao criar conta');
  }
}