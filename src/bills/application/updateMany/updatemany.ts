import { InternalServerErrorException } from "@nestjs/common";
import { Bill } from "../../domain/entities/bill.entity";
import { Repository } from "typeorm";
import { GetOne } from "../getOne/getOne";
import { UpdatePaymentManyDto } from "../../infra/dto/update-payment-many.dto";

export async function UpdateMany(updatePaymentManyDto: UpdatePaymentManyDto, repository: Repository<Bill>) {
  if (!updatePaymentManyDto.billIds || updatePaymentManyDto.billIds.length === 0) {
    throw new InternalServerErrorException('No bill IDs provided');
  }
  const bills = []
  try {
    for (const bill_id of updatePaymentManyDto.billIds) {
      let updatedBill = await GetOne(bill_id, repository);

      updatedBill.paymentMethod.paymentDate = new Date(updatePaymentManyDto.paymentMethod.paymentDate);
      updatedBill.paymentMethod.paymentType = updatePaymentManyDto.paymentMethod.paymentType;

      await repository.update(bill_id, updatedBill); 
      bills.push(updatedBill);
    }
    return bills;
  } catch (error) {
    throw new InternalServerErrorException('Erro ao atualizar várias contas: ' + error.message);
  }
}
