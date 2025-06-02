import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinDate,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AvailableTimeDto } from './create-agenda.dto';

export class CreateUnusualDto {
  @ApiProperty({
    description: 'data que quer remover horários',
    example: '2024-11-08T00:00:00z',
  })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date(), {
    message: 'Schedule date must be after current date'
  })
  date: Date;

  @ApiProperty({
    type: [AvailableTimeDto],
    description: 'Horários indisponiveis no dia',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailableTimeDto)
  unavaliableTimes: AvailableTimeDto[];
}
