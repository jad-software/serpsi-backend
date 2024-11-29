import { NotFoundException } from "@nestjs/common";
import { Bill } from "src/bills/domain/entities/bill.entity";
import { Repository } from "typeorm";

export async function GetOne(id: string, repository: Repository<Bill>) {
  try {
    return await repository.createQueryBuilder("bill")
      .where("bill.id = :id", { id })
      .getOneOrFail();
  }
  catch (error) {
    throw new NotFoundException('conta não encontrada');
  }
}