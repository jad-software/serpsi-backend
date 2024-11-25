import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, MinDate } from 'class-validator';
import { IMeetings } from '../../../meetings/domain/intefaces/meetings.interface';
import { FrequencyEnum } from './frequency.enum';
import { Transform } from 'class-transformer';

export class CreateMeetingDto implements IMeetings {

  @ApiProperty({
    example: '2025-11-15T08:00:00z',
    description: 'data e hora da sessão',
  })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date(), {
    message: 'Schedule date must be after current date'
  })
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
