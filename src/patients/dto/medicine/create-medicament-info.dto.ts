import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateMedicineDto } from './create-medicine.dto';
import { Type } from 'class-transformer';
import { Patient } from '../../../patients/entities/patient.entity';

export class CreateMedicamentInfoDto {
  @ApiProperty({
    type: CreateMedicineDto,
    description: 'medicamento',
  })
  @ValidateNested()
  @Type(() => CreateMedicineDto)
  medicine: CreateMedicineDto;

  @ApiProperty({
    type: Number,
    description: 'dosagem do medicamento',
    example: 250,
  })
  @IsNotEmpty()
  @IsInt()
  dosage: number | string;

  @ApiProperty({
    type: String,
    description: 'unidade de medida da dosagem',
    example: 'mg',
  })
  @IsNotEmpty()
  @IsString()
  dosageUnity: string;

  @ApiProperty({
    type: Number,
    description: 'frequencia do uso do medicamento no dia',
    example: 2,
  })
  @IsNotEmpty()
  @Min(1)
  @IsInt()
  frequency: number;

  @ApiProperty({
    type: Date,
    description: 'Primeiro horário do dia do remédio',
    example: '2024-01-01T08:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  firstTimeOfTheDay: Date;

  @ApiProperty({
    type: Date,
    description: 'Data de início do uso do medicamento',
    example: '2024-07-20T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    type: String,
    description: 'Observações relevantes sobre o uso medicamento',
    example: 'Tomar antes de comer',
    nullable: true,
  })
  @IsString()
  observation?: string;
}
