import { InternalServerErrorException } from "@nestjs/common";
import { Bill } from "src/bills/domain/entities/bill.entity";
import { UpdateBillDto } from "src/bills/infra/dto/update-bill.dto";
import { Repository } from "typeorm";
import { GetOne } from "../getOne/getOne";

export async function Update(id: string, updateBillDto: UpdateBillDto, repository: Repository<Bill>) {
  try {
    let bill = await GetOne(id, repository);

    let updatedBill = new Bill(updateBillDto);
    await repository.update(id, updatedBill);
    bill = await GetOne(id, repository);

    return bill;
  }
  catch (error) {
    throw new InternalServerErrorException(
      'problemas ao atualizar uma conta'
    );
  }
}