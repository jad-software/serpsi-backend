import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class CreateCrpDto {
  @ApiProperty({
    type: String,
    description: 'numero de Crp',
    example: '00/000001',
  })
  @IsNotEmpty()
  @Matches(/^\d{2}\/\d{6}$/, {
    message: 'CRP Inválido',
  })
  crp: string;
}
