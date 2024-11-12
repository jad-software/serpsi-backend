import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class GetScheduleDAO {
  @ApiProperty({
    type: Date,
    description: 'Primeiro dia do intervalo',
    example: '2024-05-13T00:00:00-03:00',
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    type: Date,
    description: 'último dia do intervalo',
    example: '2024-05-13T23:59:59-03:00',
    nullable: true,
  })
  @IsDateString()
  endDate?: Date;
}
