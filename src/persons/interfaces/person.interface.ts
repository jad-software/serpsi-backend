import { CreateAddressDto } from '../dto/createAddress.dto';
import { UpdateAddressDto } from '../dto/updateAddress.dto';
import { Address } from '../entities/address.entity';
import { Cpf } from '../vo/cpf.vo';
import { Phone } from '../vo/phone.vo';

export interface IPerson {
  name: string;
  rg: string;
  profilePicture: string;
  birthdate: Date;
  phone: Phone;
  cpf: Cpf;
  address: CreateAddressDto | UpdateAddressDto | Address;
}
