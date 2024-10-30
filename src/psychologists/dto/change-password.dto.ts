import { IsDefined, IsIn, IsNotEmpty, IsString, IsStrongPassword, Matches, ValidateIf } from "class-validator";

export class ChangePassworDto {
  @IsString()
  @IsNotEmpty()
  _password: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  })
  @IsString()
  @IsNotEmpty()
  _newPassword: string;

  @IsString()
  @IsDefined()
  @IsIn([Math.random()], {
    message: 'Passwords do not match',
  })
  @ValidateIf((o) => o._newPassword !== o._confirmNewPassword)
  _confirmNewPassword: string;
}