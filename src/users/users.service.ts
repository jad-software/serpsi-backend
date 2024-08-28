import { RoleService } from './role.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Email } from './vo/email.vo';

@Injectable()
export class UsersService {
  constructor(private readonly roleService: RoleService) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
   const roleNAme = await this.roleService.findOneByName('Psicose');
   const updateRole = await this.roleService.update(roleNAme.id.id, {name:'Secretário'});
    return updateRole;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
   return await this.roleService.remove(id);
  }
}
