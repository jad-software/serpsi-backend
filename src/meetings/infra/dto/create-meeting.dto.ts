import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';
import { IMeetings } from 'src/meetings/domain/intefaces/meetings.interface';
import { FrequencyEnum } from './frequency.enum';

export class CreateMeetingDto implements IMeetings {

  @ApiProperty({
    example: '2024-05-15T08:00:00z',
    description: 'data e hora da sessão',
  })
  @IsNotEmpty()
  @IsDateString()
  schedule: Date;

  @ApiProperty({
    example: 'patient_id',
    description: 'O id do paciente a ser atendido',
  })
  @IsNotEmpty()
  @IsString()
  patient: string;

  @ApiProperty({
    example: 'psychologist_id',
    description: 'O id do psicólogo o qual o paciente é atendido',
  })
  @IsNotEmpty()
  @IsString()
  psychologist: string;

  @ApiProperty({
    example: '1',
    description: 'o Número de sessões a serem criadas',
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: FrequencyEnum.AVULSO,
    description: 'frequência das sessões || se quantidade for 1, ele é ignorado',
  })
  @IsNotEmpty()
  @IsEnum(FrequencyEnum)
  frequency: FrequencyEnum;
}
