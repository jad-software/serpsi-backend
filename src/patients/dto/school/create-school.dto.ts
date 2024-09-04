import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ISchool } from '../../interfaces/school.interface';
import { ApiProperty } from '@nestjs/swagger';
import { CNPJ } from '../../../constants';

export class CreateSchoolDto implements ISchool {
  @ApiProperty({
    type: String,
    description: 'nome da escola',
    example: 'escola ativa idade',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'CNPJ da escola',
    example: '00.000.000/0001-00',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(RegExp(CNPJ.REGEX), { message: 'CNPJ inválido' })
  CNPJ: string;
}
