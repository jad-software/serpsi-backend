import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Day } from '../vo/days.enum';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AvailableTimeDto {
  @ApiProperty({
    type: 'string',
    description: 'Horário de inicio',
    example: '10:00',
  })
  @IsString()
  @IsNotEmpty()
  _startTime: string;

  @ApiProperty({
    type: 'string',
    description: 'Horário de termino',
    example: '12:00',
  })
  @IsString()
  @IsNotEmpty()
  _endTime: string;

  id: string;
}

export class AgendaDto {
  @ApiProperty({
    enum: Day,
    description: 'Dia da semana',
    example: Day.SEGUNDA,
  })
  @IsNotEmpty()
  @IsEnum(Day, { each: true })
  _day: Day;

  @ApiProperty({
    type: [AvailableTimeDto],
    description: 'Horários disponiveis por dia',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailableTimeDto)
  _avaliableTimes: AvailableTimeDto[];
}

export class CreateAgendaDto {
  @ApiProperty({
    type: String,
    description: 'id do psicólogo ao qual pertence a agenda',
    example: '2315cd8e-093e-4f7b-badc-55ae4c6e105d',
  })
  @IsNotEmpty()
  @IsString()
  psychologistId: string;

  @ApiProperty({
    type: Number,
    description: 'Valor da sessão em reais',
    example: 150.50,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  meetValue: number;

  @ApiProperty({
    type: Number,
    description: 'Duraçao da sessão em minutos',
    example: 50,
  })
  @IsNumber()
  @IsPositive()
  meetDuration: number;

  @ApiProperty({
    type: [AgendaDto],
    description: 'Agendas do psicólogo',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AgendaDto)
  agendas: AgendaDto[];
}
