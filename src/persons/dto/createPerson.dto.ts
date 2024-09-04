import { IsDate, IsNotEmpty } from 'class-validator';
import { IPerson } from '../interfaces/person.interface';
import { Cpf } from '../vo/cpf.vo';
import { Phone } from '../vo/phone.vo';
import { Type } from 'class-transformer';

export class CreatePersonDto implements IPerson {
  @IsNotEmpty()
  rg: string;

  @IsNotEmpty()
  profilePicture: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthdate: Date;

  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  phone: Phone;

  @IsNotEmpty()
  cpf: Cpf;
}
