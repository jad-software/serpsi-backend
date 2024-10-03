import { IsDateString, IsEnum, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { IAgenda } from '../interfaces/agenda.interface';
import { Day } from '../vo/days.enum';
import { Type } from 'class-transformer';
import { TimeOfDay } from './TimeOfDay.dto';

export class CreateAgendaDto {
  @IsNotEmpty({ message: 'A agenda deve conter horários para os dias' })
  @IsObject({ message: 'A agenda deve ser um objeto' })
  @ValidateNested({ each: true })
  @Type(() => Object)
  days: {
    [key in Day]: TimeOfDay[];
  };
}
