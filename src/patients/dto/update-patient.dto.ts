import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from './create-patient.dto';

export class UpdatePatientDto extends PartialType(
  OmitType(CreatePatientDto, ['medicines', 'comorbidities', 'school'] as const)
) {}
