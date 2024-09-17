import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { data_providers } from '../constants';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/createAddress.dto';
import { UpdateAddressDto } from './dto/updateAddress.dto';

@Injectable()
export class AddressesService {
  constructor(
    @Inject(data_providers.ADDRESS_REPOSITORY)
    private addressRepository: Repository<Address>
  ) {}

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
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async findById(id: string): Promise<Address> {
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
  async update(id: string, updateAddressDto: UpdateAddressDto): Promise<any> {
    try {
      const foundAddress = await this.findById(id);

      Object.assign(foundAddress, updateAddressDto);
      await this.addressRepository.update(id, foundAddress);

      return foundAddress;
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const address = await this.findById(id);
      await this.addressRepository.delete(address.id.id);
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
}
