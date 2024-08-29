import { RoleService } from './role.service';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { data_providers } from 'src/constants';
import { Repository } from 'typeorm';
import { Email } from './vo/email.vo';
import { Id } from 'src/entity-base/vo/id.vo';

@Injectable()
export class UsersService {
  constructor(
    private readonly roleService: RoleService,
    @Inject(data_providers.USER_REPOSITORY)
    private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userRole = await this.roleService.findOneByName(
        createUserDto.role as string
      );
      const userEmail = new Email(createUserDto.email as string);
      const user = new User({
        email: userEmail,
        password: createUserDto.password,
        role: userRole,
      });
      return await this.userRepository.save(user);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findAllRoles() {
    return await this.roleService.findAll();
  }

  async findOneById(id: string): Promise<User> {
    const userId = new Id(id);
    try {
      return await this.userRepository.findOne({
        relations: {
          role: true,
        },
        where: { id: userId },
      });
    } catch (err) {
      throw new NotFoundException('User not found');
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    let user: User;
    user.email = new Email(email);
    try {
      return await this.userRepository.findOneByOrFail({ ...user });
    } catch (err) {
      throw new NotFoundException('User not found');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    let updatingUser = new User(updateUserDto);

    if (updateUserDto.role)
      updatingUser.role = await this.roleService.findOneByName(updateUserDto.role as string);
    if (updateUserDto.email)
      updatingUser.email = new Email(updateUserDto.email as string);

    try {
      await this.userRepository.update(id, updatingUser);
      let user = await this.findOneById(id);
      return user;
    } catch (err) {
      throw new InternalServerErrorException(err?.message);
    }
  }

  async remove(id: string): Promise<any> {
    return await this.userRepository.delete(id);
  }
}
