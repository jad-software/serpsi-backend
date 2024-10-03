import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { IAgenda } from '../interfaces/agenda.interface';
import { Day } from '../vo/days.enum';

export class CreateAgendaDto implements IAgenda {
  @IsNotEmpty()
  startTime: string;

  @IsNotEmpty()
  endTime: string;

  @IsNotEmpty()
  @IsEnum(Day)
  day: Day;
}
