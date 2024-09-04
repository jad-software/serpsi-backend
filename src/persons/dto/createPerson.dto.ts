import { IsDate, IsNotEmpty, IsObject, Matches, ValidateNested } from 'class-validator';
import { IPerson } from '../interfaces/person.interface';
import { Cpf } from '../vo/cpf.vo';
import { Phone } from '../vo/phone.vo';
import { Type } from 'class-transformer';
import { CreateCpfDto } from './createCpf.dto';

export class CreatePersonDto implements IPerson {
  @IsNotEmpty()
  @Matches(
    new RegExp(/^\d{1,2}\.?\d{3}\.?\d{3}-?[a-zA-Z0-9]{1}$/),
    {
      message: 'Rg Inválido',
    }
  )
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


  @ValidateNested()
  @Type(() => CreateCpfDto)
  cpf: Cpf;
}
