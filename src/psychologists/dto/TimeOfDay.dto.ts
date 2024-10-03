import { IsNotEmpty } from "class-validator";

export class TimeOfDay {
  @IsNotEmpty({ message: 'O horário inicial é obrigatório' })
  initialTime: string;

  @IsNotEmpty({ message: 'O horário final é obrigatório' })
  endTime: string;
}
