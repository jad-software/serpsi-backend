import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { data_providers } from "src/constants";
import { Repository } from "typeorm";
import { Address } from "./entities/address.entity";
import { UpdateAddressDto } from "./dto/updateAddress.dto";

@Injectable()
export class AddressesService {
  constructor(@Inject(data_providers.ADDRESS_REPOSITORY)
  private addressRepository: Repository<Address>) { }
  async findAddressById(id: string): Promise<Address> {
    try {
      const address = await this.addressRepository
        .createQueryBuilder('address')
        .where('address._id = :id', { id })
        .getOneOrFail();
      return address;
    }
    catch (err) {
      throw new NotFoundException(err?.message);
    }
  }
  async updateAddress(id: string, updateAddressDto: UpdateAddressDto): Promise<any> {
    try {
      
      const updatedAddress = new Address({
        state: updateAddressDto.state,
        zipCode: updateAddressDto.zipCode,
        street: updateAddressDto.street,
        district: updateAddressDto.district,
        homeNumber: updateAddressDto.homeNumber,
        complement: updateAddressDto.complement
      });
      await this.addressRepository.update(id, updatedAddress);
      const personsAdress = await this.findAddressById(id);
      return personsAdress;
    }
    catch (err) {
      throw new NotFoundException(err?.message);
    }
  }
}