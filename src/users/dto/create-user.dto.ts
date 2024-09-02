import { IsEnum, IsNotEmpty, IsStrongPassword, Matches } from 'class-validator';
import { Email } from '../vo/email.vo';
import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../interfaces/user.interface';
import { email } from 'src/constants';
import { Role } from '../vo/role.enum';

export class CreateUserDto implements IUser {
  @ApiProperty({
    type: String,
    description: 'Email do usuário',
    example: 'william.henry.harrison@example-pet-store.com',
  })
  @IsNotEmpty()
  @Matches(RegExp(email.REGEX), {
    message: 'E-mail inválido',
  })
  email: Email | string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  })
  @ApiProperty({
    type: String,
    description:
      'senha do usuário. minLength: 8 minLowercase: 1 minUppercase: 1 minNumbers: 1',
    example: 'Senha@123',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    enum: Role,
    description: 'Nome do cargo do usuário',
    example: Role.PSYCHOLOGIST,
  })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
