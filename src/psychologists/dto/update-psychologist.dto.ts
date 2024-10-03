import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePsychologistDto } from './create-psychologist.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdatePersonDto } from 'src/persons/dto/updatePerson.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

export class UpdatePsychologistDto extends PartialType(
  OmitType(CreatePsychologistDto, ['person', 'user'] as const)
) {
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  person?: UpdatePersonDto;

  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;
 }
