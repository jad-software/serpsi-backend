import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/createPerson.dto';
import { Person } from './entities/person.enitiy';
import { data_providers } from 'src/constants';
import { Repository } from 'typeorm';
import { Phone } from './vo/phone.vo';
import { Cpf } from './vo/cpf.vo';
import { Id } from 'src/entity-base/vo/id.vo';
import { UpdatePersonDto } from './dto/updatePerson.dto';
import { CreateAddressDto } from './dto/createAddress.dto';
import { Address } from './entities/address.entity';
import { UpdateAddressDto } from './dto/updateAddress.dto';

@Injectable()
export class PersonsService {
  constructor(
    @Inject(data_providers.PERSON_REPOSITORY)
    private personRepository: Repository<Person>,
    @Inject(data_providers.ADDRESS_REPOSITORY)
    private addressRepository: Repository<Address>
  ) { }
  async create(createPersonDto: CreatePersonDto, createAddressDto: CreateAddressDto) {
    try {
      const phone = new Phone(
        createPersonDto.phone.ddd,
        createPersonDto.phone.ddi,
        createPersonDto.phone.number
      );
      const cpf = new Cpf(createPersonDto.cpf.cpf);
      const person = new Person({
        birthdate: createPersonDto.birthdate,
        phone: phone,
        profilePicture: createPersonDto.profilePicture,
        rg: createPersonDto.rg,
        cpf: cpf,
        name: createPersonDto.name,
      });
      person.address = new Address({
        state: createAddressDto.state,
        zipCode: createAddressDto.zipCode,
        street: createAddressDto.street,
        district: createAddressDto.district,
        homeNumber: createAddressDto.homeNumber,
        complement: createAddressDto.complement
      });
      await this.addressRepository.save(person.address)
      await this.personRepository.save(person);
      return person;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
  async findAll(): Promise<Person[]> {
    try {
      return await this.personRepository.find();
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
  async findOneById(id: string): Promise<Person> {
    try {
      const person = await this.personRepository
        .createQueryBuilder('person')
        .leftJoinAndSelect('person.address', 'address')
        .where('person._id = :id', { id })
        .getOneOrFail();
      return person;
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async update(id: string, updatePersonDto: UpdatePersonDto, updateAddressDto?: UpdateAddressDto) {
    try {
      const person = new Person(updatePersonDto);
      let foundPerson = await this.findOneById(id);
      if (updatePersonDto.phone) {
        person.phone = new Phone(
          updatePersonDto.phone.ddi || foundPerson.phone.ddi,
          updatePersonDto.phone.ddd || foundPerson.phone.ddd,
          updatePersonDto.phone.number || foundPerson.phone.number
        );
      }
      if (updatePersonDto.cpf) {
        person.cpf = new Cpf(updatePersonDto.cpf.cpf);
      }

      if (updateAddressDto) {
        console.log(updateAddressDto);
        await this.updateAddress(foundPerson.address.id.id, updateAddressDto);
      }

      await this.personRepository.update(
        foundPerson.id.id,
        person
      );
      foundPerson = await this.findOneById(id);
      return foundPerson;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const person = await this.findOneById(id);
      await this.personRepository.delete(person);
    } catch (err) {
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
    }
    catch (err) {
      throw new NotFoundException(err?.message);
    }
  }
  async updateAddress(id: string, updateAddressDto: UpdateAddressDto): Promise<any> {
    try {
      const personsAdress = await this.findAddressById(id);
      const updatedAddress = new Address({
        state: updateAddressDto.state,
        zipCode: updateAddressDto.zipCode,
        street: updateAddressDto.street,
        district: updateAddressDto.district,
        homeNumber: updateAddressDto.homeNumber,
        complement: updateAddressDto.complement
      });
      await this.addressRepository.update(id, updatedAddress);
    }
    catch (err) {
      throw new NotFoundException(err?.message);
    }
  }
}
