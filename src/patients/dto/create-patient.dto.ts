import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PaymentPlan } from '../vo/PaymentPlan.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IPatient } from '../interfaces/patient.interface';
import { CreateSchoolDto } from './school/create-school.dto';
import { Type } from 'class-transformer';
import { CreateComorbidityDto } from './comorbities/create-comorbidity.dto';
import { CreateMedicamentInfoDto } from './medicine/create-medicament-info.dto';
import { CreatePersonDto } from '../../persons/dto/createPerson.dto';
import { CreateParentsDto } from '../../persons/dto/createParents.dto';

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
    example: 'psychologist-id',
    description: 'O id do psicólogo o qual o paciente é atendido',
  })
  @IsNotEmpty()
  @IsString()
  psychologistId: string;

  @ApiProperty({
    type: OmitType(CreatePersonDto, ['user'] as const),
    description: 'Dados pessoais do paciente',
  })
  @ValidateNested()
  @Type(() => OmitType(CreatePersonDto, ['user'] as const))
  person: CreatePersonDto;

  @ApiProperty({
    type: [CreateParentsDto],
    description: 'Dados dos responsáveis do paciente',
  })
  @ValidateNested()
  @Type(() => CreateParentsDto)
  parents: CreatePersonDto[];

  @IsOptional()
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
