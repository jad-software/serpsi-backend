import { IsEmail, IsNotEmpty, IsStrongPassword, Matches } from "class-validator";
import { Role } from "../entities/role.entity";
import { Email } from "../vo/email.vo";

export class CreateUserDto {  
  @IsNotEmpty()
  @Matches(RegExp('^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+[.]+[a-zA-Z]{2,}$'), {
    message: 'E-mail inválido'
  })
  email: string | Email;
  
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  })
  @IsNotEmpty()
  password: string;
  
  @IsNotEmpty()
  role: string | Role;  
}
