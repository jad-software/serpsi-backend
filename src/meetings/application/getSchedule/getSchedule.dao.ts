import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GetScheduleDAO {
  @ApiProperty({
    type: Date,
    description: 'Primeiro dia do intervalo',
    example: '2024-05-13T00:00:00.000z',
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    type: Date,
    description: 'último dia do intervalo',
    example: '2024-05-13T23:59:59.999z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
