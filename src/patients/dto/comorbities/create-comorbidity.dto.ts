import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateComorbidityDto {
  @ApiProperty({
    type: String,
    description: 'nome da comorbidade',
    example: 'autismo grau 1',
  })
  @IsNotEmpty()
  @IsString({ always: true })
  name: string;
}
