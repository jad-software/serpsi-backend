import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { IMeetings } from 'src/meetings/domain/intefaces/meetings.interface';

export class CreateMeetingDto implements IMeetings {
  
  @ApiProperty({
    example: '2024-05-15T08:00:00-03:00',
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
}
