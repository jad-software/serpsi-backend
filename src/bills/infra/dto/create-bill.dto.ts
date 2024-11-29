import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, MinDate } from "class-validator";
import { IBill } from "src/bills/domain/interfaces/bill.interface";
import { BillType } from "src/bills/domain/vo/bill-type.enum";


export class CreateBillDto implements IBill {

  @ApiProperty({
    example: 'psychologist_id',
    description: 'O id do psicólogo',
  })
  @IsString()
  psychologist_id: string;

  @ApiProperty({
    type: IsNumber,
    description: 'Valor da sessão em reais',
    example: 150,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    type: Date,
    description: 'Data de vencimento da conta',
    example: new Date().toISOString().split('T')[0],
  })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dueDate: Date;

  @ApiProperty({
    type: String,
    description: 'Titulo da conta',
    example: 'Conta de Luz',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: BillType.to_receive,
    description: 'Tipo da conta (A PAGAR | A RECEBER)',
  })
  @IsNotEmpty()
  @IsEnum(BillType)
  billType: BillType;
}
