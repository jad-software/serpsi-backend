import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { bcrypt_salt, data_providers } from '../constants';
import { Repository } from 'typeorm';
import { Email } from './vo/email.vo';
import { Id } from '../entity-base/vo/id.vo';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(data_providers.USER_REPOSITORY)
    private userRepository: Repository<User>
  ) {}

  async create(
    createUserDto: CreateUserDto,
    hasTransaction: boolean = false
  ): Promise<User> {
    try {
      const userEmail = new Email(createUserDto.email as string);
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        bcrypt_salt
      );
      const user = new User({
        email: userEmail,
        password: hashedPassword,
        role: createUserDto.role,
      });
      return await this.userRepository.save(user, {
        transaction: !hasTransaction,
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: string): Promise<User> {
    let requestedUser = new User({});
    requestedUser.id = new Id(id);
    try {
      return await this.userRepository.findOneOrFail({
        where: { ...requestedUser },
      });
    } catch (err) {
      throw new NotFoundException(err?.message);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .select([
          'user._id._id',
          'user._email._email',
          'user._password',
          'user._role',
        ])
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    let updatingUser = new User(updateUserDto);

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
