import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class LoginDTO {
  @ApiProperty({
    description: 'Insira um e-mail existe',
    example: 'psi@teste.com',
  })
  @Matches(RegExp('^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+[.]+[a-zA-Z]{2,}$'), {
    message: 'E-mail inválido'
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Insira a senha que corresponde ao E-mail',
    example: 'Psiteste@123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}