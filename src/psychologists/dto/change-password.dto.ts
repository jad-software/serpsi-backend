import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsIn, IsNotEmpty, IsString, IsStrongPassword, Matches, ValidateIf } from "class-validator";

export class ChangePassworDto {

  @ApiProperty({
    type: String,
    description: 'Senha antiga',
    example: 'Teste@123',
  })
  @IsString()
  @IsNotEmpty()
  _password: string;

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
  _newPassword: string;

  @ApiProperty({
    type: String,
    description: 'Confirmar Senha Nova',
    example: 'Senha@123',
  })
  @IsString()
  @IsDefined()
  @IsIn([Math.random()], {
    message: 'Passwords do not match',
  })
  @ValidateIf((o) => o._newPassword !== o._confirmNewPassword)
  _confirmNewPassword: string;
}
