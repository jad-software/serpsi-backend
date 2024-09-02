import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { email } from '../../constants';

export class LoginDTO {
  @ApiProperty({
    description: 'Insira um e-mail existe',
    example: 'psi@teste.com',
  })
  @Matches(RegExp(email.REGEX), {
    message: 'E-mail inválido',
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
