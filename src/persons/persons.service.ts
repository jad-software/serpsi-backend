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
import { UpdatePersonDto } from './dto/updatePerson.dto';
import { AddressesService } from 'src/addresses/Addresses.service';
import { UsersService } from 'src/users/users.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

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
  async create(createPersonDto: CreatePersonDto) {
    try {
      const phone = new Phone(
        createPersonDto.phone.ddi,
        createPersonDto.phone.ddd,
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
      if(createPersonDto.user){
        const user = await this.userService.findOneById(createPersonDto.user);
        person.user = user;
      }
      const address = await this.addressService.create(createPersonDto.address);
      person.address = address;
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
        .leftJoinAndSelect('person.user', 'user')
        .where('person._id = :id', { id })
        .getOneOrFail();
      return person;
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    try {
      const person = new Person(updatePersonDto);

      let foundPerson = await this.findOneById(id);
      console.log(foundPerson);
      console.log('Phone', updatePersonDto.phone);
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
      console.log(person);
      await this.personRepository.delete(person.id.id);
      if (person.address) {
        await this.addressService.delete(person.address.id.id);
      }
      if(person.user){
        await this.userService.remove(person.user.id.id);
      }
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
  async savePersonPicture(file: Express.Multer.File, id: string){
    try {
      const person = await this.findOneById(id);
      const fileSaved = await this.cloudinaryService.uploadFile(file);
      if(fileSaved){
        person.profilePicture = fileSaved.url;
        await this.personRepository.save(person);
      }
      return person;
    }
    catch(err){
      throw new BadRequestException(err?.message);
    }
  }
}
