import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/createPerson.dto';
import { Person } from './entities/person.enitiy';
import { Id } from '../entity-base/vo/id.vo';
import { Address } from '../addresses/entities/address.entity';
import { Phone } from './vo/phone.vo';
import { Cpf } from './vo/cpf.vo';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UsersService } from '../users/users.service';
import { AddressesService } from '../addresses/Addresses.service';
import { data_providers } from '../constants';
import { PersonsService } from './persons.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePersonDto } from './dto/updatePerson.dto';

describe('PersonsService', () => {
  let service: PersonsService;
  let personRepository: Repository<Person>;
  let addressService: AddressesService;
  let userService: UsersService;
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonsService,
        {
          provide: data_providers.PERSON_REPOSITORY,
          useClass: Repository,
        },
        {
          provide: AddressesService,
          useValue: { create: jest.fn(), update: jest.fn(), delete: jest.fn() },
        },
        {
          provide: UsersService,
          useValue: { findOneById: jest.fn(), remove: jest.fn() },
        },
        {
          provide: CloudinaryService,
          useValue: {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
            searchData: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PersonsService>(PersonsService);
    personRepository = module.get<Repository<Person>>(
      data_providers.PERSON_REPOSITORY
    );
    addressService = module.get<AddressesService>(AddressesService);
    userService = module.get<UsersService>(UsersService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a person and save it in the repository', async () => {
      const createPersonDto: CreatePersonDto = {
        name: 'John Doe',
        birthdate: new Date(),
        phone: new Phone({ ddi: '+1', ddd: '123', number: '4567890' }),
        cpf: new Cpf('123.456.789-00'),
        rg: '12.345.678-9',
        profilePicture: 'teste.png',
        address: {
          street: 'Test Street',
          zipCode: '12345',
          state: 'Test State',
          city: 'cidade',
          district: 'Test District',
          homeNumber: 123,
          complement: 'nenhum',
        },
      };

      const person = new Person(createPersonDto);
      const address = new Address(createPersonDto.address);
      address.id = new Id('1');
      person.address = address;
      jest.spyOn(personRepository, 'save').mockResolvedValue(person);
      jest.spyOn(addressService, 'create').mockResolvedValue(address);

      const result = await service.create(createPersonDto);

      expect(personRepository.save).toHaveBeenCalledWith(person, {
        transaction: true,
      });
      expect(result).toEqual(person);
    });

    it('should throw BadRequestException if an error occurs', async () => {
      const createPersonDto: CreatePersonDto = {
        name: 'John Doe',
        birthdate: new Date(),
        phone: new Phone({ ddi: '+1', ddd: '123', number: '4567890' }),
        cpf: new Cpf('123.456.789-00'),
        rg: '12.345.678-9',
        address: {
          street: 'Test Street',
          zipCode: '12345',
          state: 'Test State',
          city: 'cidade',
          district: 'Test District',
          homeNumber: 123,
          complement: 'nenhum',
        },
        user: 'user-id',
      };

      jest
        .spyOn(personRepository, 'save')
        .mockRejectedValue(new Error('Repository error'));

      await expect(service.create(createPersonDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of persons', async () => {
      const persons = [new Person({ name: 'John Doe' })];
      jest.spyOn(personRepository, 'find').mockResolvedValue(persons);

      const result = await service.findAll();
      expect(result).toEqual(persons);
      expect(personRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if an error occurs', async () => {
      jest
        .spyOn(personRepository, 'find')
        .mockRejectedValue(new Error('Repository error'));

      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOneById', () => {
    it('should return a person by id', async () => {
      const person = new Person({ name: 'John Doe' });
      jest.spyOn(personRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOneOrFail: jest.fn().mockResolvedValue(person),
      } as any);

      const result = await service.findOneById('person-id');
      expect(result).toEqual(person);
    });

    it('should throw NotFoundException if no person is found', async () => {
      jest.spyOn(personRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOneOrFail: jest.fn().mockRejectedValue(new Error('Not found')),
      } as any);

      await expect(service.findOneById('person-id')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('delete', () => {
    it('should delete a person', async () => {
      const personId = new Id('person-id');
      const person = new Person({ name: 'John Doe' });
      person.id = personId; // Ajuste conforme a estrutura da entidade Person

      jest.spyOn(service, 'findOneById').mockResolvedValue(person); // Mock do método findOneById
      jest
        .spyOn(personRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any); // Mock do método delete

      await service.delete(personId.id);

      expect(personRepository.delete).toHaveBeenCalledWith(personId.id);
    });

    it('should throw BadRequestException if an error occurs', async () => {
      const personId = 'person-id';
      jest
        .spyOn(service, 'findOneById')
        .mockRejectedValue(new Error('Find error'));

      await expect(service.delete(personId)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('update', () => {
    it('should update a person', async () => {
      const id = new Id('a8c0fbb9-af01-4874-b792-e84a17c6524c');
      const updatePersonDto: UpdatePersonDto = {
        name: 'teste',
      };

      let person = {
        name: 'John Doe',
        birthdate: new Date(),
        phone: new Phone({ ddi: '+1', ddd: '123', number: '4567890' }),
        cpf: new Cpf('123.456.789-00'),
        rg: '12.345.678-9',
        address: new Address({
          street: 'Test Street',
          zipCode: '12345',
          state: 'Test State',
          district: 'Test District',
          homeNumber: 123,
        }),
        user: 'user-id',
        id: id,
      };

      let expectedPerson = new Person(person);
      expectedPerson.name = updatePersonDto.name;
      updatePersonDto;
      jest
        .spyOn(personRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(service, 'findOneById').mockResolvedValue(expectedPerson);
      expect(await service.update(id.id, updatePersonDto)).toEqual(
        expectedPerson
      );
    });

    it('should throw BadRequestException if the person is not found', async () => {
      const personId = 'person-id';
      const updatePersonDto: CreatePersonDto = {
        name: 'John Doe Updated',
        birthdate: new Date(),
        phone: new Phone({ ddi: '+1', ddd: '123', number: '4567890' }),
        cpf: new Cpf('123.456.789-00'),
        rg: '12.345.678-9',
        profilePicture: 'updated.png',
        address: new Address({
          street: 'Updated Street',
          zipCode: '54321',
          state: 'Updated State',
          district: 'Updated District',
          homeNumber: 321,
        }),
      };

      jest
        .spyOn(service, 'findOneById')
        .mockRejectedValue(new Error('Person not found'));

      await expect(service.update(personId, updatePersonDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
