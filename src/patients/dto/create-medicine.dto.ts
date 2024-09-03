import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMedicineDto {
  
  @ApiProperty({
    type: String,
    description: 'nome do remédio',
    example: 'Buscopan',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
