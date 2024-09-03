import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './vo/role.enum';
import { DatabaseModule } from '../database/database.module';
import { userProvider } from './providers/user.providers';
import { Email } from './vo/email.vo';
import { User } from './entities/user.entity';
import { TEST_INTEGRATION } from '../constants';

describe('UsersController (integration)', () => {
  let controller: UsersController;
  let service: UsersService;
  let globalUser: User;
  let globalNumberofUsers: number;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [UsersController],
      providers: [UsersService, ...userProvider],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
  
  if (TEST_INTEGRATION) {
    describe('POST /users', () => {
      it('should create a user', async () => {
        const dto: CreateUserDto = {
          email: 'john.doe@example.com',
          password: 'Senha@123',
          role: Role.PSYCHOLOGIST,
        };
        globalUser = await controller.create(dto);
        const email = new Email(dto.email as string);
        expect(globalUser).toHaveProperty('_id');
        expect(globalUser.email).toStrictEqual(email);
        expect(globalUser.role).toBe(dto.role);
      });
    });

    describe('GET /users', () => {
      it('should return an array of users', async () => {
        const users = await controller.findAll();
        globalNumberofUsers = users.length;
        expect(globalNumberofUsers).toBeGreaterThanOrEqual(1);
        expect(users[0]).toHaveProperty('_id');
        expect(users[0]).toHaveProperty('_email');
        expect(users[0]).toHaveProperty('_role');
      });
    });

    describe('GET /users/:id', () => {
      it('should return a user by id', async () => {
        const user = await controller.findOne(globalUser.id.id);
        expect(user).toHaveProperty('_email', {
          _email: 'john.doe@example.com',
        });
        expect(user).toHaveProperty('_role', Role.PSYCHOLOGIST);
      });
    });

    describe('PUT /users/:id', () => {
      it('should update a user by id', async () => {
        const updateDto: UpdateUserDto = {
          email: 'john.doe.updated@example.com',
          role: Role.ADMIN,
        };
        const email = new Email(updateDto.email as string);
        const updatedUser = await controller.update(
          globalUser.id.id,
          updateDto
        );
        expect(updatedUser).toHaveProperty('_email', email);
        expect(updatedUser).toHaveProperty('_role', Role.ADMIN);
      });
    });

    describe('DELETE /users/:id', () => {
      it('should remove a user by id', async () => {
        await controller.remove(globalUser.id.id);
        const users = await controller.findAll();
        expect(users.length).toBe(globalNumberofUsers - 1);
      });
    });
  }
});
