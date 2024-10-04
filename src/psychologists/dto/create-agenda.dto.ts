import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Day } from '../vo/days.enum';
import { Type } from 'class-transformer';


export class AvailableTimeDto {
  @IsString()
  @IsNotEmpty()
  _startTime: string;

  @IsString()
  @IsNotEmpty()
  _endTime: string;

  id: string;
}

export class AgendaDto {
  @IsNotEmpty()
  @IsEnum(Day, { each: true })
  _day: Day;

  
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => AvailableTimeDto)
  _avaliableTimes: AvailableTimeDto[];

}

export class CreateAgendaDto {
  @IsNotEmpty()
  @IsString()
  psychologistId: string;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => AgendaDto)
  agendas: AgendaDto[];
}
