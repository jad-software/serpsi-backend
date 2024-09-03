import { ApiProperty } from '@nestjs/swagger';
import { PaymentPlan } from '../vo/PaymentPlan.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { IPatient } from '../interfaces/patient.interface';

export class CreatePatientDto implements IPatient {
  @ApiProperty({
    enum: PaymentPlan,
    description: 'Tipo do plano de pagamento do paciente',
    example: PaymentPlan.MENSAL,
  })
  @IsNotEmpty()
  @IsEnum(PaymentPlan)
  paymentPlan: PaymentPlan;
}
