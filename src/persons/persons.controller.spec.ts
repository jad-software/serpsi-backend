import { Test, TestingModule } from '@nestjs/testing';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { Person } from './entities/person.enitiy';
import { CreatePersonDto } from './dto/createPerson.dto';
import { UpdatePersonDto } from './dto/updatePerson.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Phone } from './vo/phone.vo';
import { Cpf } from './vo/cpf.vo';
import { Address } from '../addresses/entities/address.entity';

describe('PersonsController', () => {
  let controller: PersonsController;
  let service: PersonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonsController],
      providers: [
        {
          provide: PersonsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            savePersonPicture: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PersonsController>(PersonsController);
    service = module.get<PersonsService>(PersonsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a person', async () => {
      const createPersonDto: CreatePersonDto = {
        name: 'John Doe',
        birthdate: new Date(),
        phone: new Phone({ ddi: '+1', ddd: '123', number: '4567890' }),
        cpf: new Cpf('123.456.789-00'),

        rg: '12.345.678-9',
        profilePicture: 'teste.png',
        address: new Address({
          street: 'Test Street',
          zipCode: '12345',
          state: 'Test State',
          district: 'Test District',
          homeNumber: '123',
        }),
      };
      const person = new Person(createPersonDto);
      jest.spyOn(service, 'create').mockResolvedValue(person);

      const result = await controller.create(createPersonDto);

      expect(result).toEqual(person);
      expect(service.create).toHaveBeenCalledWith(createPersonDto);
    });
  });

  describe('createWithPicture', () => {
    it('should throw BadRequestException if validation fails', async () => {
      const createPersonDto: CreatePersonDto = {
        name: 'John Doe',
        birthdate: new Date(),
        phone: new Phone({ ddi: '+1', ddd: '123', number: '4567890' }),
        cpf: new Cpf('invalid Cpf'), // Campo inválido para teste
        rg: '12.345.678-9',
        address: new Address({
          street: 'Test Street',
          zipCode: '12345',
          state: 'Test State',
          district: 'Test District',
          homeNumber: '123',
        }),
      };

      const file = {
        originalname: 'test.png',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException('Validation Error'));

      await expect(
        controller.createWithPicture(file, JSON.stringify(createPersonDto))
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of persons', async () => {
      const persons = [new Person({ name: 'John Doe' })];
      jest.spyOn(service, 'findAll').mockResolvedValue(persons);

      const result = await controller.findAll();

      expect(result).toEqual(persons);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return a person by id', async () => {
      const person = new Person({ name: 'John Doe' });
      jest.spyOn(service, 'findOneById').mockResolvedValue(person);

      const result = await controller.findOneById('person-id');

      expect(result).toEqual(person);
      expect(service.findOneById).toHaveBeenCalledWith('person-id');
    });

    it('should throw NotFoundException if no person is found', async () => {
      jest
        .spyOn(service, 'findOneById')
        .mockRejectedValue(new NotFoundException('Person not found'));

      await expect(controller.findOneById('person-id')).rejects.toThrowError(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should update a person', async () => {
      const personId = 'person-id';
      const updatePersonDto: UpdatePersonDto = {
        phone: new Phone({ ddi: '+1', ddd: '123', number: '4567890' }),
        cpf: new Cpf('123.456.789-01'),
      };
      const updatedPerson = new Person({ ...updatePersonDto });
      jest.spyOn(service, 'update').mockResolvedValue(updatedPerson);

      const result = await controller.update(personId, updatePersonDto);

      expect(result).toEqual(updatedPerson);
      expect(service.update).toHaveBeenCalledWith(personId, updatePersonDto);
    });
  });

  describe('delete', () => {
    it('should delete a person', async () => {
      const personId = 'person-id';
      jest.spyOn(service, 'delete').mockResolvedValue({ affected: 1 });

      const result = await controller.delete(personId);

      expect(result).toEqual({ affected: 1 });
      expect(service.delete).toHaveBeenCalledWith(personId);
    });

    it('should throw BadRequestException if deletion fails', async () => {
      const personId = 'person-id';
      jest
        .spyOn(service, 'delete')
        .mockRejectedValue(new BadRequestException('Delete error'));

      await expect(controller.delete(personId)).rejects.toThrowError(
        BadRequestException
      );
    });
  });
});
