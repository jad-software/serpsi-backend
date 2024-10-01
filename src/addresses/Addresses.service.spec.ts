import { Repository } from 'typeorm';
import { AddressesService } from './Addresses.service';
import { Address } from './entities/address.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { data_providers } from '../constants';
import { CreateAddressDto } from './dto/createAddress.dto';
import { Id } from '../entity-base/vo/id.vo';
import { UpdateAddressDto } from './dto/updateAddress.dto';

describe('Addresses Service', () => {
  let service: AddressesService;
  let mockRepository: Partial<Record<keyof Repository<Address>, jest.Mock>>;
  let mockQueryBuilder: Partial<{
    where: jest.Mock;
    select: jest.Mock;
    getOneOrFail: jest.Mock;
  }> = {
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getOneOrFail: jest.fn(),
  };
  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOneOrFail: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: data_providers.ADDRESS_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();
    service = module.get<AddressesService>(AddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create an Address', async () => {
    const createAddressDto: CreateAddressDto = {
      zipCode: '44444-44',
      state: 'BA',
      street: 'Rua de Address teste',
      district: 'District de Address teste',
      city: 'cidade',
      homeNumber: 10,
      complement: 'Complement de Address teste',
    };
    const expectedAddress = new Address({
      zipCode: '44444-44',
      state: 'BA',
      street: 'Rua de Address teste',
      district: 'District de Address teste',
      city: 'cidade',
      homeNumber: 10,
      complement: 'Complement de Address teste',
    });
    mockRepository.save.mockResolvedValue(expectedAddress);
    expect(await service.create(createAddressDto)).toEqual(expectedAddress);
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('Should return an Address By Id', async () => {
    const id = new Id('a8c0fbb9-af01-4874-b792-e84a17c6524c');
    const address = new Address({
      zipCode: '44444-44',
      state: 'BA',
      street: 'Rua de Address teste',
      district: 'District de Address teste',
      homeNumber: 10,
      complement: 'Complement de Address teste',
    });
    address.id = id;
    mockQueryBuilder.getOneOrFail.mockResolvedValue(address);
    const result = await service.findById(address.id.id);
    const idID = id.id;
    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('address');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('address._id = :id', {
      id: idID,
    });
    expect(mockQueryBuilder.getOneOrFail).toHaveBeenCalled();
    expect(result).toEqual(address);
  });
  it('should update an Address', async () => {
    const id = new Id('a8c0fbb9-af01-4874-b792-e84a17c6524c');
    const updateAddressDto: UpdateAddressDto = {
      district: 'Updated District',
      homeNumber: 37,
    };
    const address = new Address({
      zipCode: '44444-44',
      state: 'BA',
      street: 'Rua de Address teste',
      district: 'District de Address teste',
      homeNumber: 10,
      complement: 'Complement de Address teste',
    });
    address.id = id;

    let expectedAddress = new Address(address);
    expectedAddress.district = updateAddressDto.district;
    expectedAddress.homeNumber = updateAddressDto.homeNumber;

    mockRepository.update.mockResolvedValue({ affected: 1 });
    mockRepository.findOneOrFail.mockResolvedValue(expectedAddress);

    expect(await service.update(id.id, updateAddressDto)).toEqual(
      expectedAddress
    );
    expect(mockRepository.update).toHaveBeenCalledWith(
      'a8c0fbb9-af01-4874-b792-e84a17c6524c',
      expectedAddress
    );
  });
  it('Should delete an Address', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });
    await service.delete('a8c0fbb9-af01-4874-b792-e84a17c6524c');
    expect(mockRepository.delete).toHaveBeenCalledWith(
      'a8c0fbb9-af01-4874-b792-e84a17c6524c'
    );
  });
});
