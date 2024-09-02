import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './vo/role.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserService = {
    create: jest.fn((dto: CreateUserDto) => ({ id: '1', ...dto })),
    findAll: jest.fn(() => [{ id: '1', email: 'john.doe@example.com', role: Role.PSYCHOLOGIST }]),
    findOneById: jest.fn((id: string) => ({ id, email: 'john.doe@example.com', role: Role.PSYCHOLOGIST })),
    update: jest.fn((id: string, dto: UpdateUserDto) => ({ id, ...dto })),
    remove: jest.fn((id: string) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = { 
        email: 'john.doe@example.com',
        password: 'password123',
        role: Role.PSYCHOLOGIST
      };
      expect(await controller.create(dto)).toEqual({ id: '1', ...dto });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await controller.findAll()).toEqual([{ id: '1', email: 'john.doe@example.com', role: Role.PSYCHOLOGIST }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const id = '1';
      expect(await controller.findOne(id)).toEqual({ id, email: 'john.doe@example.com', role: Role.PSYCHOLOGIST });
      expect(service.findOneById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const id = '1';
      const dto: UpdateUserDto = { email: 'jane.doe@example.com', role: Role.ADMIN };
      expect(await controller.update(id, dto)).toEqual({ id, ...dto });
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const id = '1';
      expect(await controller.remove(id)).toEqual({ id });
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
