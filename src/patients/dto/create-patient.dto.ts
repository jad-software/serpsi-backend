import { ApiProperty } from '@nestjs/swagger';
import { PaymentPlan } from '../vo/PaymentPlan.enum';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { IPatient } from '../interfaces/patient.interface';
import { School } from '../entities/school.entity';
import { CreateSchoolDto } from './school/create-school.dto';
import { Type } from 'class-transformer';

export class CreatePatientDto implements IPatient {
  @ApiProperty({
    enum: PaymentPlan,
    description: 'Tipo do plano de pagamento do paciente',
    example: PaymentPlan.MENSAL,
  })
  @IsNotEmpty()
  @IsEnum(PaymentPlan)
  paymentPlan: PaymentPlan;

  @ApiProperty({
    type: CreateSchoolDto,
    description: 'Dados da escola do paciente',
  })
  @ValidateNested()
  @Type(() => CreateSchoolDto)
  school: CreateSchoolDto;
}
