import { IPerson } from "../interfaces/person.interface";
import { Cpf } from "../vo/cpf.vo";
import { Phone } from "../vo/phone.vo";

export class CreatePersonDto implements IPerson {
  rg: string;
  profilePicture: string;
  birthdate: Date;
  name: string
  phone: Phone;
  cpf: Cpf;
}