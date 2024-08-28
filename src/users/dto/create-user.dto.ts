import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";
import { Role } from "../entities/role.entity";
import { Email } from "../vo/email.vo";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string | Email;
  
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsNotEmpty()
  password: string;
  
  @IsNotEmpty()
  role: string | Role;  
}
