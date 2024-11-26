import { Address } from '../../addresses/entities/address.entity';
import { CNPJ } from '../vo/CNPJ.vo';
import { Phone } from '../../persons/vo/phone.vo';

export interface ISchool {
  name: string;
  CNPJ: CNPJ | string;
  address: Address;
  phone: Phone;
}
