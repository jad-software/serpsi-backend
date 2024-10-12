import { CreateUserDto } from '../../users/dto/create-user.dto';
import { CreatePersonDto } from '../../persons/dto/createPerson.dto';
import { Crp } from '../vo/crp.vo';
import { IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateCrpDto } from './create-crp.dto';

export class CreatePsychologistDto {
  @ApiProperty({
    type: CreateCrpDto,
    description: 'Dados do CRP do psicólogo',
  })
  @ValidateNested()
  @Type(() => CreateCrpDto)
  crp: Crp;

  @ApiProperty({
    type: IsNumber,
    description: 'Valor da sessão em reais',
    example: 150,
  })
  @IsNumber()
  @IsPositive()
  meetValue: number;

  @ApiProperty({
    type: IsNumber,
    description: 'Duraçao da sessão em minutos',
    example: 50,
  })
  @IsNumber()
  @IsPositive()
  meetDuration: number;

  @ApiProperty({
    type: OmitType(CreatePersonDto, ['user'] as const),
    description: 'Dados pessoais do psicólogo',
  })
  @ValidateNested()
  @Type(() => OmitType(CreatePersonDto, ['user'] as const))
  person: CreatePersonDto;

  @ApiProperty({
    type: CreateUserDto,
    description: 'Dados de usuário do psicólogo',
  })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
