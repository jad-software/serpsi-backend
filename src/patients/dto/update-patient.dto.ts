import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from './create-patient.dto';
import { UpdateSchoolDto } from './school/update-school.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CreateSchoolDto } from './school/create-school.dto';

export class UpdatePatientDto extends PartialType(
  OmitType(CreatePatientDto, ['medicines', 'school', 'psychologistId'] as const)
) {
  
  @IsOptional()
  @ApiProperty({
    type: UpdateSchoolDto,
    description: 'Dados da escola do paciente',
  })
  @ValidateNested()
  @Type(() => UpdateSchoolDto)
  school?: UpdateSchoolDto
}
