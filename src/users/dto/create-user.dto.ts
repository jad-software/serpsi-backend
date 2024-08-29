import { IsEmail, IsNotEmpty, IsStrongPassword, Matches } from "class-validator";
import { Role } from "../entities/role.entity";
import { Email } from "../vo/email.vo";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {  
  @ApiProperty({ type: String, description: "Email do usuário", example: "william.henry.harrison@example-pet-store.com" })
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
  @ApiProperty({ type: String, description: "senha do usuário. minLength: 8 minLowercase: 1 minUppercase: 1 minNumbers: 1", example: "Senha@123" })
  @IsNotEmpty()
  password: string;
  
  @ApiProperty({ type: String, description: "Nome do cargo do usuário", example: "Admin" })
  @IsNotEmpty()
  role: string | Role;  
}
