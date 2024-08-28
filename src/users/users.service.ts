import { RoleService } from './role.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Email } from './vo/email.vo';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly roleService: RoleService) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    return 'This action adds a new user';
  }

  async findAll() {
    return `This action returns all users`;
  }
  async findAllRoles() {
    return await this.roleService.findAll();
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    return `This action deletes a #${id} user`;
  }
}
