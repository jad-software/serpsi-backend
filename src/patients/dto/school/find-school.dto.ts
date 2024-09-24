import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSchoolDto } from './create-school.dto';

export class FindSchoolDto extends PartialType(
  OmitType(CreateSchoolDto, ['address'] as const)) {}
