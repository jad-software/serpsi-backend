import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePsychologistDto } from './create-psychologist.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdatePersonDto } from '../../persons/dto/updatePerson.dto';
import { UpdateUserDto } from '../../users/dto/update-user.dto';

export class UpdatePsychologistDto extends PartialType(
  OmitType(CreatePsychologistDto, ['person', 'user'] as const)
) {

  @ApiPropertyOptional({
    type: UpdatePersonDto,
    description: 'Dados pessoais de um psicólogo',
  })
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  person?: UpdatePersonDto;

  @ApiPropertyOptional({
    type: UpdateUserDto,
    description: 'Dados de user de um psicólogo',
  })
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;
}
