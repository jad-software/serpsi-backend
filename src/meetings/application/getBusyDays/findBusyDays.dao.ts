import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsString, Max, Min } from "class-validator";

export class FindBusyDaysDAO {
  psychologistId: string;

  @ApiProperty({
    type: Number,
    description: 'número referente ao mês requisitado',
    example: 5,
    nullable: true,
  })
  @IsNumberString({no_symbols: true})
  month?: number;
}
