import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Role } from './vo/role.enum';
import { bcrypt_salt, data_providers } from '../constants';
import { Email } from './vo/email.vo';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Id } from '../entity-base/vo/id.vo';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: Partial<Record<keyof Repository<User>, jest.Mock>>;
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
        UsersService,
        {
          provide: data_providers.USER_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDTO: CreateUserDto = {
      role: Role.PSYCHOLOGIST,
      email: 'john@example.com',
      password: 'Senha@123',
    };
    const password = await bcrypt.hash(createUserDTO.password, bcrypt_salt);
    const expectedUser: User = new User({
      role: Role.PSYCHOLOGIST,
      email: new Email('john@example.com'),
      password,
    });
    mockRepository.save.mockResolvedValue(expectedUser);

    expect(await service.create(createUserDTO)).toEqual(expectedUser);
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should retrieve all users', async () => {
    const users: User[] = [
      new User({
        role: Role.PSYCHOLOGIST,
        password: 'Senha@123',
        email: 'john@example.com',
      }),
      new User({
        role: Role.SECRETARY,
        password: 'Senha@123',
        email: 'daniel@example.com',
      }),
    ];
    mockRepository.find.mockResolvedValue(users);

    expect(await service.findAll()).toEqual(users);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should return a user by id', async () => {
    const user: User = new User({
      role: Role.PSYCHOLOGIST,
      password: 'Senha@123',
      email: new Email('john@example.com'),
    });
    user.id = new Id('f0846568-2bd9-450d-95e3-9a478e20e74b');
    mockRepository.findOneOrFail.mockResolvedValue(user);

    expect(
      await service.findOneById('f0846568-2bd9-450d-95e3-9a478e20e74b')
    ).toEqual(user);
    expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
      where: {
        _id: {
          _id: 'f0846568-2bd9-450d-95e3-9a478e20e74b',
        },
      },
    });
  });

  it('should return a user by email', async () => {
    const email = 'john@example.com';
    const user: User = {
      role: Role.PSYCHOLOGIST,
      password: 'Senha@123',
      email: new Email(email),
      id: new Id('f0846568-2bd9-450d-95e3-9a478e20e74b'),
    } as User;
    mockQueryBuilder.getOneOrFail.mockResolvedValue(user);

    const result = await service.findOneByEmail(email);

    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('user');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', {
      email,
    });
    expect(mockQueryBuilder.select).toHaveBeenCalledWith([
      'user._id._id',
      'user._email._email',
      'user._password',
      'user._role',
    ]);
    expect(mockQueryBuilder.getOneOrFail).toHaveBeenCalled();
    expect(result).toEqual(user);
  });

  it('should update a user by id', async () => {
    const updateUserDTO: UpdateUserDto = {
      role: Role.SECRETARY,
      email: 'john@example.com',
    };
    const user: User = new User({
      role: Role.PSYCHOLOGIST,
      password: 'Senha@123',
      email: new Email('john@example.com'),
    });
    const expectedUser: User = new User({
      role: Role.SECRETARY,
      email: new Email('john@example.com'),
    });

    user.id = new Id('f0846568-2bd9-450d-95e3-9a478e20e74b');

    mockRepository.update.mockResolvedValue({ affected: 1 });
    mockRepository.findOneOrFail.mockResolvedValue(expectedUser);

    expect(
      await service.update(
        'f0846568-2bd9-450d-95e3-9a478e20e74b',
        updateUserDTO
      )
    ).toEqual(expectedUser);
    expect(mockRepository.update).toHaveBeenCalledWith(
      'f0846568-2bd9-450d-95e3-9a478e20e74b',
      expectedUser
    );
  });
  it('should remove a user by id', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });

    await service.remove('f0846568-2bd9-450d-95e3-9a478e20e74b');
    expect(mockRepository.delete).toHaveBeenCalledWith(
      'f0846568-2bd9-450d-95e3-9a478e20e74b'
    );
  });
});
