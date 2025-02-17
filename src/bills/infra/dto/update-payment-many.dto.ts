import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { PaymentMethod } from "../../domain/vo/payment-method.vo";
import { PaymentType } from "../../domain/vo/payment-type.enum";
class PaymentMethodDTO {
  @ApiProperty({
    enum: PaymentType,
    description: 'Tipo de pagamento',
    example: PaymentType.CASH,
  })
  @IsNotEmpty()
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty({
    type: String,
    description: 'Data de pagamento',
    example: new Date().toISOString().split('T')[0],
  })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  paymentDate: string;
}
export class UpdatePaymentManyDto {
  @ApiProperty({
    type: [String],
    description: 'lista de Ids das contas a ser  atualizadas',
    example: ['bills_Id', 'bills_id2', 'bill_id3'],
    isArray: true
  })
  @IsString({ each: true })
  @IsNotEmpty()
  billIds: string[];

  @ApiProperty({
    type: PaymentMethodDTO,
    description: 'método de pagamento',
  })
  @ValidateNested()
  @Type(() => PaymentMethodDTO)
  paymentMethod: PaymentMethod;
}
