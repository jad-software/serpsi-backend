import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/createPerson.dto';
import { Person } from './entities/person.enitiy';
import { data_providers } from '../constants';
import { Repository } from 'typeorm';
import { Phone } from './vo/phone.vo';
import { Cpf } from './vo/cpf.vo';
import { UpdatePersonDto } from './dto/updatePerson.dto';
import { AddressesService } from '../addresses/Addresses.service';
import { UsersService } from '../users/users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Address } from 'src/addresses/entities/address.entity';

@Injectable()
export class PersonsService {
  constructor(
    @Inject(data_providers.PERSON_REPOSITORY)
    private personRepository: Repository<Person>,
    @Inject()
    private addressService: AddressesService,
    @Inject()
    private userService: UsersService,
    @Inject()
    private cloudinaryService: CloudinaryService
  ) {}
  async create(
    createPersonDto: CreatePersonDto,
    hasTransaction: boolean = false,
    file?: Express.Multer.File
  ) {
    let uploadedFileId: string | null = null;
    let addressID: string = undefined;
    try {
      const phone = new Phone(createPersonDto.phone);
      const cpf = new Cpf(createPersonDto.cpf.cpf);
      const person = new Person({
        birthdate: createPersonDto.birthdate,
        phone: phone,
        profilePicture: createPersonDto.profilePicture || '',
        rg: createPersonDto.rg,
        cpf: cpf,
        name: createPersonDto.name,
      });
      if (createPersonDto.user) {
        const user = await this.userService.findOneById(createPersonDto.user);
        person.user = user;
      }
      if (createPersonDto.address) {
        const address = await this.addressService.create(
          createPersonDto.address,
          hasTransaction
        );
        person.address = address;
        addressID = address.id.id;
      }
      if (file) {
        const fileSaved = await this.cloudinaryService.uploadFile(file);
        if (fileSaved) {
          uploadedFileId = fileSaved.public_id;
          person.profilePicture = fileSaved.url;
        }
      }

      await this.personRepository.save(person, {
        transaction: !hasTransaction,
      });
      return person;
    } catch (err) {
      if (uploadedFileId) {
        await this.cloudinaryService.deleteFile(uploadedFileId); // Remova a imagem do Cloudinary
      }
      if (addressID) {
        await this.addressService.delete(addressID);
      }
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
        .leftJoinAndSelect('person.user', 'user')
        .where('person._id = :id', { id })
        .getOneOrFail();
      return person;
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async findOneByUserId(id: string): Promise<Person> {
    try {
      const person = await this.personRepository
        .createQueryBuilder('person')
        .leftJoinAndSelect('person.address', 'address')
        .where('person.user = :id', { id })
        .getOneOrFail();
      return person;
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async findOneByCPF(cpf: Cpf): Promise<Person> {
    try {
      return await this.personRepository
        .createQueryBuilder('person')
        .where('person._cpf = :cpf', { cpf: cpf.cpf })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    try {
      const person = new Person(updatePersonDto);

      let foundPerson = await this.findOneById(id);

      if (updatePersonDto.phone) {
        person.phone = new Phone(updatePersonDto.phone || foundPerson.phone);
      }
      if (updatePersonDto.cpf) {
        person.cpf = new Cpf(updatePersonDto.cpf.cpf);
      }

      if (updatePersonDto.address) {
        await this.addressService.update(
          foundPerson.address.id.id,
          updatePersonDto.address
        );
        delete person.address;
      }

      await this.personRepository.update(foundPerson.id.id, person);
      foundPerson = await this.findOneById(id);
      return foundPerson;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const person = await this.findOneById(id);
      const publicID = this.cloudinaryService.searchData(person.profilePicture);

      await this.personRepository.delete(person.id.id);
      if (person.address) {
        await this.addressService.delete(person.address.id.id);
      }
      if (person.user) {
        await this.userService.remove(person.user.id.id);
      }
      if (publicID) {
        await this.cloudinaryService.deleteFile(publicID);
      }
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
  async savePersonPicture(file: Express.Multer.File, id: string) {
    try {
      const person = await this.findOneById(id);
      const oldProfilePicture = person.profilePicture;
      const fileSaved = await this.cloudinaryService.uploadFile(file);
      if (fileSaved) {
        person.profilePicture = fileSaved.url;
        await this.personRepository.save(person);

        if (oldProfilePicture) {
          const publicID = this.cloudinaryService.searchData(oldProfilePicture);
          if (publicID) {
            await this.cloudinaryService.deleteFile(publicID);
          }
        }
      }
      return person;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
}
