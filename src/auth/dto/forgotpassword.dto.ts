import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  ValidateIf,
} from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    type: String,
    description: 'Senha Nova',
    example: 'Senha@123',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    type: String,
    description: 'Confirmar Senha Nova',
    example: 'Senha@123',
  })
  @IsString()
  @IsDefined()
  @ValidateIf((o) => o._newPassword !== o._confirmNewPassword, {
    message: 'As senhas não conferem',
  })
  confirmNewPassword: string;

  @ApiProperty({
    description: 'Insira o token',
    example: 'token_grande',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
