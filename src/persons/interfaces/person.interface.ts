import { Address } from 'src/addresses/entities/address.entity';
import { UpdateAddressDto } from '../../addresses/dto/updateAddress.dto';
import { Cpf } from '../vo/cpf.vo';
import { Phone } from '../vo/phone.vo';
import { CreateAddressDto } from '../../addresses/dto/createAddress.dto';

export interface IPerson {
  name: string;
  rg: string;
  profilePicture?: string;
  birthdate: Date;
  phone: Phone;
  cpf: Cpf;
  address: CreateAddressDto | UpdateAddressDto | Address;
}
