import { CreateAddressDto } from './dto/createAddress.dto';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { data_providers } from 'src/constants';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { UpdateAddressDto } from './dto/updateAddress.dto';

@Injectable()
export class AddressesService {
  constructor(
    @Inject(data_providers.ADDRESS_REPOSITORY)
    private addressRepository: Repository<Address>
  ) { }

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    try {
      const address = new Address({
        state: createAddressDto.state,
        zipCode: createAddressDto.zipCode,
        street: createAddressDto.street,
        district: createAddressDto.district,
        homeNumber: createAddressDto.homeNumber,
        complement: createAddressDto.complement,
      });
      await this.addressRepository.save(address);
      return address;
    }
    catch (err) {
      throw new BadRequestException(err?.message);
    }

  }

  async findAddressById(id: string): Promise<Address> {
    try {
      const address = await this.addressRepository
        .createQueryBuilder('address')
        .where('address._id = :id', { id })
        .getOneOrFail();
      return address;
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }
  async updateAddress(
    id: string,
    updateAddressDto: UpdateAddressDto
  ): Promise<any> {
    try {
      const updatedAddress = new Address({
        state: updateAddressDto.state,
        zipCode: updateAddressDto.zipCode,
        street: updateAddressDto.street,
        district: updateAddressDto.district,
        homeNumber: updateAddressDto.homeNumber,
        complement: updateAddressDto.complement,
      });
      await this.addressRepository.update(id, updatedAddress);
      const personsAdress = await this.findAddressById(id);
      return personsAdress;
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }
}
