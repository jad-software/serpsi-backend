import { CreateUserDto } from '../../users/dto/create-user.dto';
import { CreatePersonDto } from '../../persons/dto/createPerson.dto';
import { Crp } from '../vo/crp.vo';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';
import { CreateCrpDto } from './create-crp.dto';

export class CreatePsychologistDto {

  @ValidateNested()
  @Type(() => CreateCrpDto)
  crp: Crp;

  @ValidateNested()
  @Type(() => OmitType(CreatePersonDto, ['user'] as const))
  person: CreatePersonDto;

  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}