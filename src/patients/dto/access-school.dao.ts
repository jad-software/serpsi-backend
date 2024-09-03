import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSchoolDto } from './create-school.dto';
import { ISchool } from '../interfaces/school.interface';
import { IsEmpty, IsString, Length, Matches } from 'class-validator';
import { CNPJ } from 'src/constants';

export class AccessSchoolDao {
  @ApiProperty({
    type: String,
    description: 'nome da escola',
    example: 'escola ativa idade',
    required: false,
  })
  name?: string;

  @ApiProperty({
    type: String,
    description: 'CNPJ da escola',
    example: '00.000.000/0001-00',
    required: false,
  })
  CNPJ?: string;
}
