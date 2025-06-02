import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsDate, MinDate, IsNumber } from "class-validator";


export class UpdateMeetingDto {
  @ApiProperty({
    example: '2025-11-15T08:00:00z',
    description: 'data e hora da sessão',
  })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date(), {
    message: 'Schedule date must be after current date'
  })
  schedule: Date;

  @ApiProperty({
      example: '100.50',
      description: 'O valor caso queira alterar',
    })
    @IsNumber()
    amount: number; 
}
