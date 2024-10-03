import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { IAgenda } from '../interfaces/agenda.interface';
import { Day } from '../vo/days.enum';

export class CreateAgendaDto implements IAgenda {
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @IsNotEmpty()
  @IsEnum(Day)
  day: Day;
}
