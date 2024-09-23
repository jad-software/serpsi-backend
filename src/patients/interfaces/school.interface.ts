import { Address } from 'src/addresses/entities/address.entity';
import { CNPJ } from '../vo/CNPJ.vo';
import { Phone } from 'src/persons/vo/phone.vo';

export interface ISchool {
  name: string;
  CNPJ: CNPJ | string;
  address: Address;
  phone: Phone;
}
