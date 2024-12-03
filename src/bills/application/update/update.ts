import { InternalServerErrorException } from "@nestjs/common";
import { Bill } from "../../domain/entities/bill.entity";
import { UpdateBillDto } from "../../infra/dto/update-bill.dto";
import { Repository } from "typeorm";
import { GetOne } from "../getOne/getOne";

export async function Update(id: string, updateBillDto: UpdateBillDto, repository: Repository<Bill>) {
  let bill = await GetOne(id, repository);
  try {
    let updatedBill = new Bill(updateBillDto);
    await repository.update(id, updatedBill);
  }
  catch (error) {
    throw new InternalServerErrorException(
      'problemas ao atualizar uma conta'
    );
  }

  bill = await GetOne(id, repository);
  return bill;
}