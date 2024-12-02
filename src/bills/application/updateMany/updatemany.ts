import { InternalServerErrorException } from "@nestjs/common";
import { Bill } from "src/bills/domain/entities/bill.entity";
import { Repository } from "typeorm";
import { GetOne } from "../getOne/getOne";
import { UpdatePaymentManyDto } from "src/bills/infra/dto/update-payment-many.dto";

export async function UpdateMany(updatePaymentManyDto: UpdatePaymentManyDto, repository: Repository<Bill>) {
  // Add error handling for empty billIds array
  if (!updatePaymentManyDto.billIds || updatePaymentManyDto.billIds.length === 0) {
    throw new InternalServerErrorException('No bill IDs provided');
  }

  const bills = []
  try {
    for (const bill_id of updatePaymentManyDto.billIds) {
      let updatedBill = await GetOne(bill_id, repository);
      // Add null check for updatedBill
      if (!updatedBill) {
        throw new InternalServerErrorException(`Bill with id ${bill_id} not found`);
      }
      updatedBill.paymentMethod.paymentDate = new Date(updatePaymentManyDto.paymentMethod.paymentDate);
      updatedBill.paymentMethod.paymentType = updatePaymentManyDto.paymentMethod.paymentType;
      // Remove console.log in production code
      await repository.update(bill_id, updatedBill); // Use save() instead of update() to ensure entity lifecycle hooks are triggered
      bills.push(updatedBill);
    }
    return bills;
  } catch (error) {
    throw new InternalServerErrorException('Error updating bills: ' + error.message);
  }
}
