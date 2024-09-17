import { ApiProperty } from '@nestjs/swagger';
import { PaymentPlan } from '../vo/PaymentPlan.enum';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { IPatient } from '../interfaces/patient.interface';
import { CreateSchoolDto } from './school/create-school.dto';
import { Type } from 'class-transformer';
import { CreateComorbidityDto } from './comorbities/create-comorbidity.dto';
import { CreateMedicamentInfoDto } from './medicine/create-medicament-info.dto';

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

  @ApiProperty({
    type: [CreateComorbidityDto],
    description: 'Dados das comorbidades do paciente',
  })
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateComorbidityDto)
  comorbidities: CreateComorbidityDto[];

  @ApiProperty({
    type: [CreateMedicamentInfoDto],
    description: 'Dados do uso de medicamentos do paciente',
  })
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateMedicamentInfoDto)
  medicines: CreateMedicamentInfoDto[];
}
