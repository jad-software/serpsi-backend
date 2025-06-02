import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmpty, IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import { ForgotPasswordDto } from './forgotpassword.dto';

export class TokenDTO {

  @ApiProperty({
    description: 'Insira o token',
    example: 'token_grande',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
